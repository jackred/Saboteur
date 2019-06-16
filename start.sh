here=`pwd`
src="/usr/src/test-bot-build/"

if [ $# -ne 0 ];
then
    if [ $1 = "debug" ];
    then
    docker run --rm -v $here/config.json:$src/config.json --log-opt max-size=10m --net ng_network -it --name saboteur saboteur
    elif [ $1 = "test" ];
    then
    docker run --rm -v $here/config.test.json:$src/config.json --log-opt max-size=10m --net ng_network -it --name test test
    else
	echo "wrong argument"
    fi
else
    docker run -v $here/config.json:$src/config.json --log-opt max-size=10m --restart always --net ng_network -dit --name saboteur saboteur
fi
 

