#!/bin/bash
cd /home/ec2-user/mercadoandino-app
nohup node server.js > /var/log/mercadoandino.log 2>&1 &
