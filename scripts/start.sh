#!/bin/bash
cd /home/ec2-user/app
BUCKET=mercadoandino-uploads-amac-01 PORT=80 nohup node server.js > /var/log/mercadoandino.log 2>&1 &
