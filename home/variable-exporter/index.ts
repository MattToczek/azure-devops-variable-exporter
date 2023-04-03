import tl = require('azure-pipelines-task-lib');
import fs = require('fs')


function readFile(filePath: string): Promise<string>  {
    const fileContent: Promise<string> = new Promise<string> ((resolve, reject) => {
        fs.readFile(filePath, "utf8", function(err, jsonString) {
            if (err) reject("Error reading FILE3");
            else resolve(jsonString);
        });
    })
    return fileContent
}

function setVariables(jsonObj: {[key:string]: any}){
    let keys = Object.keys(jsonObj);
    let vals = keys.map(k => jsonObj[k])
    return {keys: keys, vals: vals}
}

interface outputVarsParams{
    varObject: {
        keys:string[], 
        vals:any[]
    }, 
    outputSuffix?: string, 
    secretSuffix?: string, 
    previousVarName?: string
}

function outputVars({varObject, outputSuffix, secretSuffix, previousVarName = ""}: outputVarsParams){
    for ( var i: number = 0; i <= varObject.keys.length; i ++ ){
        const currentVarName: string = `${previousVarName}${varObject.keys[i]}`
        if ( typeof varObject.vals[i] == "string" || typeof varObject.vals[i] == "number" || typeof varObject.vals[i] == "boolean" ) {
            console.log(`##vso[task.setvariable variable=${currentVarName};${outputSuffix}${secretSuffix}]${varObject.vals[i]}`)
        } else if (Array.isArray(varObject.vals[i])) {
            const nestedKeys = [...varObject.vals[i].keys()]
            const nestedKeysStr = nestedKeys.map(String)
            outputVars({
                varObject: {
                    keys: nestedKeysStr, 
                    vals: nestedKeys.map(k => varObject.vals[i][k])
                }, 
                outputSuffix: outputSuffix, 
                secretSuffix: secretSuffix, 
                previousVarName: `${currentVarName}_`
            })
        } else {
            if (varObject.keys[i] != undefined){
                var nestedKeys = Object.keys(varObject.vals[i])
                outputVars({
                    varObject: {
                        keys: nestedKeys, 
                        vals: nestedKeys.map(k => varObject.vals[i][k])
                    }, 
                    outputSuffix: outputSuffix, 
                    secretSuffix: secretSuffix, 
                    previousVarName: `${currentVarName}_`
                })
            }
        }
    }
}

async function run() {
    try {
        const inputString: string | undefined = tl.getInput('variablesource', true);
        const output: boolean | false = tl.getBoolInput('output', false);
        const secret: boolean | false = tl.getBoolInput('secret', false);
        const outputSuffix: string = output ? "isOutput=true;" : ""
        const secretSuffix: string = secret ? "issecret=true;" : ""

        if (inputString == 'bad') {
            tl.setResult(tl.TaskResult.Failed, 'No file input found!');
            return;
        } else if (typeof(inputString) == "string"){
            let jsonProm: Promise<string> = readFile(inputString)
            jsonProm.then((value) => {
                const parsedJson = JSON.parse(value)
                const keyVal: {keys:string[], vals:any[]} = setVariables(parsedJson)
                outputVars({
                    varObject: keyVal, 
                    outputSuffix: outputSuffix, 
                    secretSuffix: secretSuffix
                })
            });
        }
    }
    catch (err) {
        if (err instanceof Error) {
            tl.setResult(tl.TaskResult.Failed, err.message);
          } else {
            tl.setResult(tl.TaskResult.Failed, "Issue surfacing error message!");
          }
    }
}

run();
