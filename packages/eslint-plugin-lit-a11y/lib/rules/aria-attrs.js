/**
 * @fileoverview Elements cannot use an invalid ARIA attribute.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { isInvalidAriaAttribute } = require('../utils/aria.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import("eslint").Rule.RuleModule} */
const AriaAttrsRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Elements cannot use an invalid ARIA attribute.',
      category: 'Accessibility',
      recommended: false,
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    return {
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node)) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              for (const attr of Object.keys(element.attribs)) {
                if (isInvalidAriaAttribute(attr)) {
                  const loc = analyzer.getLocationForAttribute(element, attr);
                  context.report({
                    loc,
                    message: 'Invalid ARIA attribute "{{attr}}".',
                    data: {
                      attr,
                    },
                  });
                }
              }
            },
          });
        }
      },
    };
  },
};

module.exports = AriaAttrsRule;
