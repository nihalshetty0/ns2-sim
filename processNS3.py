def convert_to_val(str):
    val = str.split(" ")            #returns
    d1 = val[0]                     #events (r,+,-)
    d2 = float(val[1])
    d3 = int(val[2])                #fromNode(1,2,3)
    d4 = int(val[3])                #toNode (1,2,3)
    d6 = int(val[5])                     #pktSize
    d9 = val[8]                     #src address
    d10 = val[9]                    #dest address
    return d1, d2, d3, d4, d6, d9, d10


def processFile(trFile):
    dataSent = [0,0,0,0,0,0,0]
    dataRec =  [0,0,0,0,0,0,0]
    dataDrop = [0,0,0,0,0,0,0]
    i=0
    totaltime = 0
    totalPacketSize = 0
    lines = trFile.readlines()
    for line in lines: #iterate through each line in .tr file
        line = line.decode("utf-8") #disable this to run on native python
        d1, d2,d3, d4, d6, d9, d10 = convert_to_val(line)

        # trFile.seek(0)
        # noOfNode = len(listNodes(trFile))
        noOfNode = 6

        totalPacketSize += d6 /1000
        totaltime += d2 /1000

        for i in range(0,noOfNode):
            if d1=="r" and d4== i:
                dataRec[i] += 1
        
            if d1=='-' and d3==i:
                dataSent[i] += 1

            if d1=='d' and d3==i:
                dataDrop[i] += 1

            i=i+1     

    print(len(listNodes(trFile)))

    Throughput = totalPacketSize/totaltime

    for i in range(0,noOfNode):
        print(f"Total number of data packets received at Node "+ str(i) +": ", dataRec[i])

    for i in range(0,noOfNode):
        print(f"Total number of data packets sent at Node "+str(i)+": ", dataSent[i])

    for i in range(0,noOfNode):
        print(f"Total number of data packets dropped at Node "+str(i)+": ", dataDrop[i])

    print(f"Throughput: " +str(Throughput)+" kbps")

    return dataRec, dataSent, dataDrop, Throughput

# def returnText(trFile):
#     # lines = trFile.readlines()
#     for line in lines:
#         line = line.decode("utf-8") #disable this to run on native python

#     # return lines
#     return trFile.readlines()

def listNodes(trFile):
    nodes = []
    # trFile.seek(0)
    lines = trFile.readlines()
    for line in lines: #iterate through each line in .tr file
        line = line.decode("utf-8") #disable this to run on native python
        d1, d2,d3, d4, d6, d9, d10 = convert_to_val(line)
        if (d3 not in nodes):
            nodes.append(d3)
            # print(f"d3 {d3}")
        if (d4 not in nodes):
            nodes.append(d4)
            # print(f"d4 {d4}")
    return nodes


def nodeToNode(trFile):
    transfer = []
    lines = trFile.readlines()
    for line in lines: #iterate through each line in .tr file
        line = line.decode("utf-8") #disable this to run on native python
        d1, d2,d3, d4, d6, d9, d10 = convert_to_val(line)
        
        dataTransfer = []
        dataTransfer.append(d3)
        dataTransfer.append(d4)

        transfer.append(dataTransfer)

    # print(type(transfer))
    return transfer