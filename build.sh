#!/bin/bash

code="$PWD"
opts=-g
cd . > /dev/null
g++ $opts $code/build.bat -o run.bat
cd $code > /dev/null
