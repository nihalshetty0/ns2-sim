from processNS3 import *

trFile = open('C:\\Users\\nihal\\Desktop\\Play\\colProject\\sample.tr',"r")
# tcppack, tcppack1 = processFile(trFile)
# print(tcppack)
# print(listNodes(trFile))
# print(nodeToNode(trFile))


rows, cols = (5, 5) 
arr = [[0]*cols]*rows 
 

lines = trFile.readlines()
for line in lines: #iterate through each line in .tr file
    # line = line.decode("utf-8") #disable this to run on native python
    d1, d3, d4, d6, d9, d10 = convert_to_val(line)


print(processFile(trFile))
trFile.close()
print(arr)