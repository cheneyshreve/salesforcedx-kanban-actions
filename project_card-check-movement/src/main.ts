import * as core from '@actions/core';
import * as github from '@actions/github';

const INPUT_FROMCOLUMNID = 'fromColumnId';
const INPUT_FROMCOLUMNNAME = 'fromColumnName';
const INPUT_TOCOLUMNID = 'toColumnId';
const INPUT_TOCOLUMNNAME = 'toColumnName';
const OUTPUT_ISMATCH = 'isMatch';

async function run() {
  try {
    const fromColumnId = (core.getInput(INPUT_FROMCOLUMNID) as any) as number;
    const fromColumnName = core.getInput(INPUT_FROMCOLUMNNAME);
    const toColumnId = (core.getInput(INPUT_TOCOLUMNID) as any) as number;
    const toColumnName = core.getInput(INPUT_TOCOLUMNNAME);

    const myToken = core.getInput('myToken');
    const octokit = new github.GitHub(myToken);
    const fromColumn = await octokit.projects.getColumn({
      column_id: fromColumnId
    });

    if (fromColumn.data.name.toUpperCase() !== fromColumnName.toUpperCase()) {
      core.debug(
        `${fromColumnName.toUpperCase()} doesn't match with ${
          fromColumn.data.name.toUpperCase
        }`
      );
      core.setOutput(OUTPUT_ISMATCH, '0');
    }

    const toColumn = await octokit.projects.getColumn({
      column_id: toColumnId
    });

    if (toColumn.data.name.toUpperCase() !== toColumnName.toUpperCase()) {
      core.debug(
        `${toColumnName.toUpperCase()} doesn't match with ${
          toColumn.data.name.toUpperCase
        }`
      );
      core.setOutput(OUTPUT_ISMATCH, '0');
    }

    core.setOutput(OUTPUT_ISMATCH, '1');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();