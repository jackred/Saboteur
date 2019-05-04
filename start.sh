here=`pwd`
src="/usr/src/test-bot-build/"

if [ $# -ne 0 ];
then
    if [ $1 = "debug" ];
    then
    sudo docker run --rm -v $here/config.json:$src/config.json --log-opt max-size=10m -it --name saboteur saboteur
    else
	echo "wrong argument"
    fi
else
    sudo docker run -v $here/config.json:$src/config.json --log-opt max-size=10m --restart always -dit --name saboteur saboteur
fi
 

