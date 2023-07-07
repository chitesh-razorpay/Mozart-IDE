import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReactMarkdown from 'react-markdown';

const LearnPage = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : null);
  };

  const configData = {
    sections: [
      {
        title: 'Overview',
        content: `
Mozart is a no-code orchestration framework written in GoLang. This framework was introduced to ensure faster integrations with 3rd parties, i.e. Gateways, and vendors, given the primary business of Razorpay involves bank integrations.        
        `
      },
      {
        title: 'Configuration Structure',
        content: `
# How to write a config for a new gateway?
For integrating a gateway, you need to write atleast 2 kinds of configs:
* 1 base config
* action config

## base config
A _base config_ will contain all different kinds of steps (& their data) that are needed for a particular gateway.
Every action will use this _base config_ to filter out steps and then filter out data inside a step to create a custom action level config.

A _base config_ will have 1 key:
* steps

_steps_ is a list of .....................steps to be performed. 
every _step_ will have 3 keys:
* name
* component
* input

so a _base config_ will look like this:
\`\`\`json
{
    "steps" : [
        {
            "name" : "<step name 1>",
            "component" : "<Component name>",
            "input" : {
                "<key 1>" : "<value 1>",
                "<key 2>" : "<value 2>"
            }
        },
        {
            "name" : "<step name 2>",
            "component" : "<Component name>",
            "input" : {
                "<key 1>" : "<value 1>",
                "<key 2>" : "<value 2>",
                "..." : "..."
            }
        }
    ]
}
\`\`\`
#### steps
steps is a list of steps to execute in the mentioned order.
every request that comes to mozart will be the input to the first _step_. After the execution of first _step_, the output of this step will go as input to 2nd _step_ for execution. 2nd _step_'s output will be input of 3rd _step_ and so on.

##### Note:
Order of the steps is not important in _base config_. It will just specify the step data for every step. The actual order of execution of every step will be driven by the _action config_

#### name
_name_ is a reference-name to the current step. every step for a gateway (across all actions) should have a unqiue name.you will need this name for 


you can put in whatever string that helps you distinguish this step from others.

#### component
component is the name of the component you want to execute for this step. currently, these components are available:
* Validator
* Mapper
* CybersourceRequestExecutorV2
* ErrorHandler
* Transformer
* RequestExecutor

check out their wikis/godocs to know what they actually do.

#### input
input is a json object which can contain data in key-value pairs form.
this is required to provide some gateway/action specific data to component for its execution.
For example:
* ErrorHandler will need to know which field in gateway response to check for success response and which field to use for error code mapping.
* RequestExecutor needs to know what kind of request it needs to execute & what kind of response it should expect.

What all key-values are required for a component will depend upon that particular component's config. Check their wiki pages for all the keys required.
##### Note: 
this \`input\` is NOT same as the mozart request-input. this \`input\` is the extra information required by a component to process the data coming into it. actual data that is required will pass on from one step to other.

## action config
for every action of a gateway, you need to create an _action config_. This _action config_ will filter out data from _base config_ and add/override some data to create a new config for the action.

_action config_ will just tell the _Parser_ which _step_ and config keys are required. Parser will then use this _action config_ to extract _steps_ from _base config_, override some input of a step if required, ,and then generate and save a new config which will then be used by mozart to process requests coming in for this gateway action.
every _action config_ will contain 2 keys:
* base
* steps

### base
_base_ is the filepath to the base config. this will most likely the path to the _gateway base config_

### steps
steps is a list of all the steps to be performed by mozart for a particular gateway action.

every step will have 3 keys:
* name
* override
* extra

#### name
name is the reference-name of the step you want to get executed for this action.
this is the same _name_ you specified in base config. _Parser_ will use this name to copy step data from base config.

#### override (optional)
override is a list of keys, for which you want to copy step data from _base config_ to this action's config.
This can be used to filter out some of config keys-values which are required for this action.
the data for only these keys will get copied to action specific config.

Example:
For the _validator_ step of a card gateway, you may need card input in some actions(\`pay_init\`, \`authenticate_init\`), while in other actions,you may not(\`verify_refund\`). So, in _base config_ you need to specify all kinds in validations rules you may end up using for this gateway. including card number, card cvv, card expiry month etc. In your _action config_, for _override_ of _validator_ step, you'll list only those fields which you want to be validated for this step. for \`pay_init\` action, you'll include card.number, card.cvv, card.expiry_month. for \`verify_refund\`, you'll not.
this should become clear with cybersource example mentioned below.

##### Note:
this is optional key. in case _override_ is not specified for a step in _action config_, the whole step data will get copied for that step.

#### extra (optional)
_extra_ can be used to replace config input data for some of the fields.
suppose you want to specify some custom data for a few keys or you want to add a new key-value in config for some action, then those custom config key-value pairs can be specified here.

Example: For a gateway, if the error condition varies with action, you'll need to replace the \`conditions\` key of error handler in every _action config_. In _errorHandler_ step of every _action config_, you'll have to add an extra section with \`conditions\






\` key-value pair:
\`\`\`json
{
    "name" : "errorHandler",
    "fields" : ["input_fields", "error_mapping_fields"],
    "extra" : {
        "conditions" : "reasonCode == 475"
    }
}
\`\`\`

so an _action config_ would look like this:
\`\`\`json
{
  "base" : "path/to/base/config",
  "steps" : [
    {
      "name" : "<step name 1>", 
      "override" : ["<key1>" , "<key2>"]
    },
    {
      "name" : "<step name 3>", 
      "override" : ["<key1>" , "<key2>", "<key 4>"],
      "extra" : {
        "<key 3>" : "<value 3>",
        "<key 4>" : "<value 4>"
      }
    }
  ]
}
\`\`\`

## Authenicate_init action_config:
\`\`\`json
{
  "base": "app/config/cybersource/base.json",
  "steps": [
    {
      "name": "Validator",
      "override": [
        "entities.terminal.gateway_terminal_id",
        "entities.terminal.gateway_terminal_password",
        "entities.payment.id",
        "entities.payment.currency",
        "entities.payment.amount",
        "entities.card.number",
        "entities.card.expiry_month",
        "entities.card.expiry_year",
        "entities.card.network_code",
        "entities.gateway.payment.callbackUrl"
      ]
    },
    {
      "name": "amount_transformer"
    },
    {
      "name": "amount_datatype_transformer"
    },
    {
      "name": "requestMapper",
      "override": [
        "merchantID",
        "merchantReferenceCode",
        "card_accountNumber",
        "card_expirationMonth",
        "card_expirationYear",
        "purchaseTotals_currency",
        "purchaseTotals_grandTotalAmount",
        "payerAuthEnrollService_run"
      ]
    },
    {
      "name": "RequestExecutor",
      "extra": {
        "current_action": "authenticate_init"
      }
    },
    {
      "name": "errorHandler",
      "extra": {
        "conditions": "(d == 'ACCEPT') || (r == 475)",
        "input_fields": {
          "d": "Envelope.Body.replyMessage.decision",
          "r": "Envelope.Body.replyMessage.reasonCode"
        }
      }
    },
    {
      "name": "ucafCollectionIndicator_copy_to_eci"
    },
    {
      "name": "responseFormatter",
      "override": [
        "data.payment_id",
        "data.attempt_id",
        "data.gateway_reference_id1",
        "data.reason_code",
        "data.xid",
        "data.enrollment_status",
        "data.eci",
        "data.commerce_indicator",
        "data._raw",
        "error",
        "success",
        "data.status"
      ]
    },
    {
      "name": "next_redirect_transformer"
    }
  ]
}
\`\`\`

## Capture _action config_ :
\`\`\`json
{
  "base": "app/config/cybersource/base.json",
  "steps": [
    {
      "name": "Validator",
      "override": [
        "entities.terminal.gateway_terminal_id",
        "entities.payment.id",
        "entities.gateway.pay_init.gateway_reference_id1",
        "entities.merchant.billing_label",
        "entities.payment.currency",
        "entities.payment.amount"
      ]
    },
    {
      "name": "amount_transformer"
    },
    {
      "name": "billing_label_transformer"
    },
    {
      "name": "amount_datatype_transformer"
    },
    {
      "name": "billing_label_empty_transformer"
    },
    {
      "name": "billing_label_trim_transformer"
    },
    {
      "name": "requestMapper",
      "override": [
        "merchantID",
        "merchantReferenceCode",
        "ccCaptureService_authRequestID",
        "ccCaptureService_reconciliationID",
        "purchaseTotals_currency",
        "purchaseTotals_grandTotalAmount",
        "invoiceHeader_merchantDescriptor",
        "ccCaptureService_run"
      ]
    },
    {
      "name": "RequestExecutor",
      "extra": {
        "current_action": "capture"
      }
    },
    {
      "name": "errorHandler"
    },
    {
      "name": "responseFormatter",
      "override": [
        "data.payment_id",
        "data.attempt_id",
        "data.gateway_reference_id1",
        "data.reason_code",
        "data.reconciliationID",
        "data._raw",
        "error",
        "data.received",
        "success"
      ],
      "extra": {
        "data.decision": {
          "shift": "Envelope.Body.replyMessage.decision"
        }
      }
    },
    {
      "name": "status_transformer",
      "extra": {
        "output_fields": {
          "true": {
            "data.status": {
              "default": "captured"
            }
          },
          "false": {
            "data.status": {
              "default": "capture_failed"
            }
          }
        }
      }
    }
  ]
}
\`\`\`

## Capture final config
\`\`\`json
{
  "steps": [
    {
      "name": "Validator",
      "component": "Validator",
      "input": {
        "entities.gateway.pay_init.gateway_reference_id1": [
          "required"
        ],
        "entities.merchant.billing_label": [
          "required"
        ],
        "entities.payment.amount": [
          "required"
        ],
        "entities.payment.currency": [
          "required",
          "len:3"
        ],
        "entities.payment.id": [
          "required"
        ],
        "entities.terminal.gateway_terminal_id": [
          "required"
        ]
      }
    },
    {
      "name": "amount_transformer",
      "component": "Transformer",
      "input": {
        "input_fields": {
          "amt": "entities.payment.amount"
        },
        "output_fields": {
          "shift": "entities.payment.amount"
        },
        "rule": " amt / 100 ",
        "type": "modifyField"
      }
    },
    {
      "name": "billing_label_transformer",
      "component": "Transformer",
      "input": {
        "input_fields": {
          "x": "entities.merchant.billing_label"
        },
        "output_fields": {
          "shift": "entities.merchant.billing_label"
        },
        "rule": "[^a-zA-Z0-9 ]+",
        "type": "regexReplace"
      }
    },
    {
      "name": "amount_datatype_transformer",
      "component": "Transformer",
      "input": {
        "input_fields": {
          "amt": "entities.payment.amount"
        },
        "output_fields": {
          "any_key": "entities.payment.amount"
        },
        "rule": "string",
        "type": "changeDataType"
      }
    },
    {
      "name": "billing_label_empty_transformer",
      "component": "Transformer",
      "input": {
        "input_fields": {
          "x": "entities.merchant.billing_label"
        },
        "output_fields": {
          "true": {
            "entities.merchant.billing_label": {
              "default": "Razorpay Payments"
            }
          }
        },
        "rule": "x == ''",
        "type": "conditionalCopy"
      }
    },
    {
      "name": "billing_label_trim_transformer",
      "component": "Transformer",
      "input": {
        "input_fields": {
          "x": "entities.merchant.billing_label"
        },
        "output_fields": {
          "shift": "entities.merchant.billing_label"
        },
        "rule": "trim:19",
        "type": "string"
      }
    },
    {
      "name": "requestMapper",
      "component": "Mapper",
      "input": {
        "ccCaptureService_authRequestID": {
          "shift": "entities.gateway.pay_init.gateway_reference_id1"
        },
        "ccCaptureService_reconciliationID": {
          "shift": "entities.payment.id"
        },
        "ccCaptureService_run": {
          "default": true
        },
        "invoiceHeader_merchantDescriptor": {
          "shift": "entities.merchant.billing_label"
        },
        "merchantID": {
          "shift": "entities.terminal.gateway_terminal_id"
        },
        "merchantReferenceCode": {
          "shift": "entities.payment.id"
        },
        "purchaseTotals_currency": {
          "shift": "entities.payment.currency"
        },
        "purchaseTotals_grandTotalAmount": {
          "shift": "entities.payment.amount"
        }
      }
    },
    {
      "name": "RequestExecutor",
      "component": "CybersourceRequestExecutorV2",
      "input": {
        "connection_timeout": "APP_ENV|namespace.payment.gateway.cybersource.connection_timeout",
        "current_action": "capture",
        "datasink_input_steps": [
          "datasink.init.INPUT",
          "datasink.requestMapper.OUTPUT"
        ],
        "url": "APP_ENV|namespace.payment.gateway.cybersource.URL"
      }
    },
    {
      "name": "errorHandler",
      "component": "ErrorHandler",
      "input": {
        "conditions": "d == 'ACCEPT'",
        "error_mapping_fields": {
          "gateway": "Envelope.Body.replyMessage.reasonCode"
        },
        "input_fields": {
          "d": "Envelope.Body.replyMessage.decision"
        }
      }
    },
    {
      "name": "responseFormatter",
      "component": "Mapper",
      "input": {
        "data._raw": {
          "shift": "raw"
        },
        "data.attempt_id": {
          "shift": "sink.entities.payment.id"
        },
        "data.decision": {
          "shift": "Envelope.Body.replyMessage.decision"
        },
        "data.gateway_reference_id1": {
          "shift": "Envelope.Body.replyMessage.requestID"
        },
        "data.payment_id": {
          "shift": "sink.entities.payment.id"
        },
        "data.reason_code": {
          "shift": "Envelope.Body.replyMessage.reasonCode"
        },
        "data.received": {
          "default": true
        },
        "data.reconciliationID": {
          "shift": "sink.entities.payment.id"
        },
        "error": {
          "shift": "mozartError"
        },
        "success": {
          "shift": "success"
        }
      }
    },
    {
      "name": "status_transformer",
      "component": "Transformer",
      "input": {
        "input_fields": {
          "x": "success"
        },
        "output_fields": {
          "false": {
            "data.status": {
              "default": "capture_failed"
            }
          },
          "true": {
            "data.status": {
              "default": "captured"
            }
          }
        },
        "rule": "x == true",
        "type": "conditionalCopy"
      }
    }
  ]
}
\`\`\`
`,
      },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* <Grid item xs={12} sx={{ m: 2 }}>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{
              backgroundColor: '#1976d2',
              color: 'white',
              padding: '12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <InfoIcon sx={{ marginRight: '8px' }} />
            Learn
          </Typography>
        </Grid> */}
        <Grid item xs={12}>
          <Accordion
            sx={{ m: 2 }}
            expanded={expandedSection === 'config'}
            onChange={handleAccordionChange('config')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">Mozart Tutorial</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ width: '100%' }}>
                {configData.sections.map((section, index) => (
                  <Accordion key={index}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">{section.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ReactMarkdown>{section.content}</ReactMarkdown>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Add more accordion sections for other topics */}
          <Accordion
            sx={{ m: 2 }}

            expanded={expandedSection === 'section2'}
            onChange={handleAccordionChange('section2')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">Try Mozart</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">Content for Input Section  will be available soon.</Typography>
            </AccordionDetails>
          </Accordion>

          {/* <Accordion
            sx={{ m: 2 }}

            expanded={expandedSection === 'section3'}
            onChange={handleAccordionChange('section3')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">Execute(Coming Soon)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">Content for Execute will be available soon.</Typography>
            </AccordionDetails>
          </Accordion> */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default LearnPage;
