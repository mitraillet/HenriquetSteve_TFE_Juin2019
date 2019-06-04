#!/usr/bin/env python
# coding: utf-8

from __future__ import absolute_import, division, print_function

import pymysql.err as mysqlerr
import time
import calendar
from datetime import datetime, timedelta
import re

from escauxlib import config

import escauxmonitoring.connector.prometheus as prometheus
import escauxlib.log as log

import matomo_metrics.db as db

SCHEMA = [
  {
    'name': 'general_info_user',
    'descr': 'Contains all the info about a user',
    'tags': ['browser_name', 'browser_name_version', 'config_device_type', 'config_os'],
    'type': 'counter'
  },
  {
    'name': 'config_resolution',
    'descr': 'Contains screen resolution',
    'tags': ['config_resolution'],
    'type': 'counter'
  },
  {
    'name': 'visit',
    'descr': 'The number of the new and returned visitor',
    'tags': ['visitor_returning'],
    'type': 'counter'
  },
  {
    'name': 'event_name',
    'descr': 'All the event name',
    'tags': ['id_visitor', 'id_visit', 'browser_name', 'config_device_type', 'config_os', 'event_category', 'event_name'],
    'type': 'counter'
  },
]

class Scraper():
  def __init__(self, port=9133):
    self.running = True
    self.connector = prometheus.PrometheusConnector(SCHEMA, 'matomo', port)
    self.connection = db.connection()
    self.connection.decoders[246] = float # We don't want `Decimal`s, we want floats!
    # Dict from https://github.com/matomo-org/device-detector
    self.device_types = config.loader(config.config["json"]["device-types"])
    self.available_browsers = config.loader(config.config["json"]["browsers"])
    self.os_families = config.loader(config.config["json"]["os-families"])
    self.id_visit_list = []

  def osSelector(self, osAbreviation):
    for os_name, os_abv in self.os_families.items():
      for os_abv_temp in os_abv:
        if os_abv_temp == osAbreviation:
          return os_name
    return "Unknown"

  def getValueList(self, list, index):
    try:
      return list[index]
    except IndexError:
      return 'Unknown'

  def run(self):
    last_id = None
    while self.running:
      sql = '''
            SELECT  llva.idlink_va,
                    llva.idvisit AS id_visit,
                    llva.idsite AS id_site,
                    HEX(llva.idvisitor) AS id_visitor,
                    llva.server_time,
                    event_action.name AS event_action,
                    event_category.name AS event_category,
                    lv.visitor_returning,
                    lv.config_browser_name,
                    lv.config_browser_version,
                    lv.config_device_type,
                    lv.config_os,
                    lv.config_resolution
                FROM matomo.matomo_log_link_visit_action AS llva
            LEFT JOIN matomo.matomo_log_action AS event_action
                ON llva.idaction_event_action = event_action.idaction 
            LEFT JOIN matomo.matomo_log_action AS event_category
                ON llva.idaction_event_category = event_category.idaction
            JOIN matomo.matomo_log_visit AS lv
                ON llva.idvisit = lv.idvisit
          '''
      if last_id is None:
        sql += ' WHERE llva.server_time > (DATE_SUB(NOW(), INTERVAL 1 MINUTE))'
      else:
        sql += 'WHERE llva.idlink_va > {}'.format(last_id)

      try:
        with self.connection.cursor() as cursor:
          start = time.time()
          cursor.execute(sql)
          end = time.time()
          log.debug("Query took {} seconds".format(end - start))
        self.connection.commit()
        data = cursor.fetchall()
        log.debug("Found {} matches".format(len(data)))
        for entry in data:
          event_name_string = str(entry['event_category']) + ' ' + str(entry['event_action'])
          os_name = self.osSelector(entry['config_os'])
          config_browser_name = self.available_browsers.get(entry['config_browser_name'], "Unknown")
          config_device_type = self.getValueList(self.device_types, entry['config_device_type'])
          dict = {
            'event_name': {
              'labels': (entry['id_visitor'], entry['id_visit'], config_browser_name,
                          config_device_type, os_name, entry['event_category'], event_name_string),
              'value': 1
            },
          }

          # Avoid to have information multiple time because of the redundancy of the query result
          if entry['id_visit'] not in self.id_visit_list:
            dict['general_info_user'] = {
              'labels': ( config_browser_name,
                        config_browser_name + ' ' + entry['config_browser_version'],
                        config_device_type, os_name),
              'value': 1
            }
            dict['visit'] = {
              'labels': ('new' if entry['visitor_returning'] == 0 else 'returned',),
              'value': 1
            }
            dict['config_resolution'] = {
              'labels': (entry['config_resolution'],),
              'value': 1
            }
            self.id_visit_list.append(entry['id_visit'])

          self.connector.push(dict)

          last_id = entry['idlink_va']

      except mysqlerr.ProgrammingError as e:
        log.error("Potential issue in sql statement: {}".format(e))
      except Exception as e:
        log.error("Issue with : {}".format(e))
      time.sleep(2.0)

  def stop(self):
    self.running = False
