# Export Variables Task
Azure Pipelines extension that exports variables from JSON.

## Usage
TODO: Once published and screenshotted etc.

### Parameters
The parameters of the task are described bellow, in parenthesis is the YAML name:

- **Source of the variables** (variablesource): the file path to the JSON file from which the variables should be exported.

## Output variables
The task outputs variables that can currently only be used within the same job scope. The keys that variable values will be mapped to are defined in the following examples:

#### JSON file
``` 
{
    "simple": "value",
    "list": ["value1", "value2"],
    "object": {
        "first_value": 1,
        "second_value": 2 
    }
}
```
### Resulting Pipeline Variables:
| Key | Value |
| --- | --- |
| `simple` | `"value"` |
| `list_0` | `"value1"` |
| `list_1` | `"value2"` |
| `object_first_value` | `1` |
| `object_second_value` | `2` |
