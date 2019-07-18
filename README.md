# INFINITUM-Web
Web based input field validation and Controlled AJAX environment

## Data Dictionary

validationDiv - Main Div to Display Server Related Errors

dataFields - An array of input field ids

regexFields - An array of regex or predefined rules for the dataFields array

## Validation Rules
### email 
Validate Email Address

### 12h-time 
Validate Time Foramt in 12 Hour Format (01:00 PM)

### alpha-numeric
Validate Alpha Numeric String 

### numeric 
Validate Numeric Input

### link 
Validate URL

### check 
Validate True/False

### date
Validate Date in Format (YYYY-MM-DD)

### time
Validate Time in Format (HH:MM:SS)

## Methods

### addValidation (divId, regex)
Add Validation Rule to Already Initialized Validation
### removeValidation (divId)
Remove Validation Rule from Already Initialized Validation

## Usage

var validation = new infinitum.Validation(validationDiv, dataFields, regexFields);

validation.validateFields(); //Validate All Input Types Except file. Returns True/False

validation.validateFiles(); //Validate Only File Inputs. Returns True/False

validation.validateAll(); //Validate All Inputs Types. Returns True/False

var inputData = validation.inputToJSON(); //Returns Validated Inputs with Sanitization

## Example

### Validate Text Based Inputs
var validation = new infinitum.Validation('validation-result', ['email-address'], ['email']);

if (validation.validateFields()) console.log('Everything is Ok');

### Validate File Based Inputs
var fileRule = 'jpeg,jpg,png|2048';//File Type Seperated with , and size in bytes followed by |

var validation = new infinitum.Validation('validation-result', ['profile-pic'], [fileRule]);

if (validation.validateFiles()) console.log('Everything is Ok');
