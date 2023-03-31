import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('secret', 'true');
tmr.setInput('output', 'true');
tmr.setInput('variablesource', path.join(__dirname, 'json_files/simple.json'));

tmr.run();
