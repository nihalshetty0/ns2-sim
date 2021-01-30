# run pip install flask
from flask import Flask, flash, redirect, url_for, render_template, request, session
from processNS3 import *

app = Flask(__name__)
app.secret_key = "mojo"

@app.route('/')
def index(): 
    return render_template('index.html', transfer=[])


@app.route('/', methods=['POST'])
def upload_file():
    trFile = request.files['file']
    dataRec = []
    dataSent = []

    if trFile.filename != '':
        dataRec, dataSent, dataDrop, Throughput = processFile(trFile)
        trFile.seek(0)
        # nodes = listNodes(trFile)
        # trFile.seek(0)
        transfer = nodeToNode(trFile)

        # dataReceived
        Throughput = round(Throughput, 3)
        se = "Data packets sent at each node:____"
        re = "Data packets received at each node: "
        dr = "Data packets dropped at each node: "
        tro = "Throughput: "+str(Throughput)+" kbps"

        trFile.seek(0)
        for i in range(0,len(listNodes(trFile))):
            se += str(i) + " : "+ str(dataSent[i])+" | "
            re += str(i) + " : "+  str(dataRec[i])+" | "
            dr += str(i) + " : "+ str(dataDrop[i])+" | "

        return render_template("index.html", 
            node2_o= se,
            node3_o= re,
            node4_o = dr,
            node5_o= tro,
            transfer= transfer
            )

    else:
        flash(f"Please enter a file!!")
        return redirect(url_for("index"))
    # return redirect(url_for("index"))
  
if __name__ == "__main__":
    app.run(debug=True)