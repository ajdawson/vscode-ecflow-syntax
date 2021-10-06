const fs = require('fs');
const path = require('path');

const ecFlowDefinition = require('../syntaxes/ecflow-def.tmLanguage.json');
const testDefinition = fs.readFileSync(path.resolve(__dirname, '../syntax-examples/ecflow-def.def'), 'utf8');

const returnAllMatches = (haystack, needle) => {
    const regex = new RegExp(needle, 'gm');

    let match;
    const result = [];

    while (match = regex.exec(haystack)) {
        if (match && match.length > 1) result.push(match.slice(1));
        else if (match) result.push(match[0]);
    }

    return result;
};

describe('ecflow-def.tmLanguage.json', () => {
    it('has valid schema', () => {
        expect.assertions(1);

        const tmLanguageSchema = 'https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json';

        expect(ecFlowDefinition.$schema).toStrictEqual(tmLanguageSchema);
    });

    it('matches comments', () => {
        expect.assertions(1);

        const commentMatch = ecFlowDefinition.repository.comments.match;
        const commentMatches = returnAllMatches(testDefinition, commentMatch);

        expect(commentMatches).toStrictEqual([
            '# A simple suite definition',
            '# script path',
            '# repeat date',
            '# run after archive',
        ]);
    });

    it('matches nodes', () => {
        expect.assertions(2);

        const nodeStartMatch = ecFlowDefinition.repository.nodes.patterns[0].match;
        const startMatches = returnAllMatches(testDefinition, nodeStartMatch);

        expect(startMatches).toStrictEqual([
            ['suite', 'simple'],
            ['family', 'main'],
            ['task', 'setup'],
            ['task', 'worker'],
            ['family', 'lag'],
            ['task', 'archive'],
            ['task', 'cleanup'],
        ]);

        const nodeEndMatch = ecFlowDefinition.repository.nodes.patterns[1].match;
        const endMatches = returnAllMatches(testDefinition, nodeEndMatch);

        expect(endMatches).toStrictEqual([
            ['endfamily'],
            ['endfamily'],
            ['endsuite'],
        ]);
    });

    it('matches attributes', () => {
        expect.assertions(1);

        const attributeMatch = ecFlowDefinition.repository.attributes.patterns[0].match;
        const attributeMatches = returnAllMatches(testDefinition, attributeMatch);

        expect(attributeMatches).toStrictEqual([
            ['edit', 'ECF_INCLUDE', '"/path/to/include"', '# script path'],
            ['edit', 'ECF_HOME', '"/path/to/home"', undefined],
            ['edit', 'MODE', "'normal'", undefined],
        ]);
    });

    it('matches expressions', () => {
        expect.assertions(1);

        const expressionMatch = ecFlowDefinition.repository.expressions.match;
        const expressionMatches = returnAllMatches(testDefinition, expressionMatch);

        expect(expressionMatches).toStrictEqual([
            ['trigger', 'setup == complete', undefined ],
            ['trigger', 'main:YMD > lag:YMD or main == complete', undefined ],
            ['trigger', 'archive == complete', '# run after archive' ]
        ]);
    });

    it('matches default status', () => {
        expect.assertions(1);

        const defstatusMatch = ecFlowDefinition.repository.defstatus.match;
        const defstatusMatches = returnAllMatches(testDefinition, defstatusMatch);

        expect(defstatusMatches).toStrictEqual([
            ['queued'],
        ]);
    });

    it('matches repeats', () => {
        expect.assertions(1);

        const repeatMatch = ecFlowDefinition.repository.repeats.match;
        const repeatMatches = returnAllMatches(testDefinition, repeatMatch);

        expect(repeatMatches).toStrictEqual([
            ['date', 'YMD', '20200101 20201231 5', undefined],
            ['date', 'YMD', '20200101 20201231 5', '# repeat date'],
        ]);
    });
});
