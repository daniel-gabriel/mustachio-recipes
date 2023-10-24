echo To run without rebuilding, use:
echo     ./local.sh --no-build

if [ "$1" != "--no-build" ]; then
  docker-compose up --build -d
else
  docker-compose up -d
fi

#echo If containers start successfully, the UI and the API are available at the below URLs:
echo     UI:  http://localhost:8080
echo     API: http://localhost:3002/docs
