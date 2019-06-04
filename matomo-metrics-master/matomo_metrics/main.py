#!/usr/bin/env python
# coding: utf-8

import signal
import sys

import pkg_resources

import escauxlib.log as log
from escauxlib import config
import matomo_metrics.scraper as scraper

SCRAPER = None

def signal_handler(signal, frame):
    log.info('Stopping...')
    SCRAPER.stop()
    sys.exit(0)


def parse_options(argument_string=None):
  """Parse user-provided options"""
  import argparse

  try:
    version = "%(prog)s " + str(pkg_resources.get_distribution("setup.py").version)
  except pkg_resources.DistributionNotFound:
    version = "dev"

  descr = "Matomo Metrics (" + version + ")"

  parser = argparse.ArgumentParser(description=descr)

  parser.add_argument("--verbosity", "-v", default=3, action="count", help="Increase the debug verbosity")
  parser.add_argument('--version', action='version', version=version)

  parser.add_argument('--port', '-p', type=int, default=9133, help="Port where web server will listen (default 9133)")
  parser.add_argument('--config', '-c', type=str, default="config.json",
                      help="Configuration file path. (default config.json)")

  if argument_string:
    arguments = parser.parse_args(argument_string.split())
  else:
    # from command line arguments
    arguments = parser.parse_args()
  return arguments


def setup():
  global SCRAPER
  args = parse_options()
  signal.signal(signal.SIGINT, signal_handler)
  config.load(args.config)
  signal.signal(signal.SIGINT, signal_handler)
  SCRAPER = scraper.Scraper()
  SCRAPER.run()


if __name__ == "__main__":
  setup()
