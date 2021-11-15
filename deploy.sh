remoteDir='/appweb/web/tenleadclinicfront'

npm run build:test

# tar -cvf dist.tar dist/**

scp  -r dist/** root@47.92.75.215:$remoteDir