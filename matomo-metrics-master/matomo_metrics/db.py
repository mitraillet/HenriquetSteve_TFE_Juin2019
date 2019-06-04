#!/usr/bin/env python
# coding: utf-8

import pymysql.cursors

from escauxlib import config

db = None


class Database:
  def __init__(self):
    self.connection = self.__connect()

  def __connect(self):
    conn = pymysql.connect(host=config.config['database']['host'],
                           user=config.config['database']['username'],
                           password=config.config['database']['password'],
                           db=config.config['database']['database'],
                           charset='utf8mb4',
                           cursorclass=pymysql.cursors.DictCursor)
    return conn


def connection():
  db = Database()
  return db.connection
