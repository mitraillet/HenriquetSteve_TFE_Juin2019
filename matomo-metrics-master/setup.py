#!/usr/bin/env python
# coding: utf-8
# file use to create a package from the exporter

from setuptools import setup, find_packages

setup(
  name="matomo-metrics",
  version="0.0.0",
  description='Prometheus exporter for matomo metrics',

  # simple to run
  entry_points={
    'console_scripts': [
      'matomo-metrics = matomo_metrics.main:setup',
    ]
  },

  author='Steve Henriquet',
  author_email="she@escaux.com",

  packages=find_packages(exclude=('tests', 'docs')),

  include_package_data=True,  # include data from MANIFEST.in

  download_url=(""),

  install_requires=[
    'escauxlib',
    'escauxmonitoring',
    'pymysql',
    'prometheus-client'

  ],

)
