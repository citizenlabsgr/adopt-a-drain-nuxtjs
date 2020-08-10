#################
# SCRIPT: Write SQL ReadMe.md
#################
# set source folder relative to this file
# get list of files
# process .sql files
# pluck all lines with regex
# format as md table
# write to README.md in source file


from util import Util
import re

folder = '../aad-db/sql/'
outname = 'README.md'
## READ: Make list of file in a folder
files = Util().getFileList(folder, ext='sql')
files.sort()
## PROCESS: Read all files

readme = []


#readme.append('# Changes')
#readme.append('\n')
#readme.append('| file | type | detail |')
#readme.append('| ---- | ------- | ------ |')
for f in files:
    readme.append('# {}'.format(f))
    readme.append('\n')
    readme.append('## Changes')
    readme.append('\n')
    readme.append('| status | version | detail |')
    readme.append('| ------ | ------- | ------ |')
    lines = Util().getLines(folder, f)

    lines = [ln for ln in lines if re.search('[-]+[ ]+[A-Za-z]+[ ]+[\.0-9]+[:]',ln)]

    for ln in lines:
        ln = '| {} |'.format(
                                  ln.strip()
                                  .replace('-- ','')
                                  .replace('DONE ', 'Done | ')
                                  .replace('TODO ', '__PAUSE__ | ')
                                  .replace(': ', ' | ')
                                  .replace('\n',''))

        readme.append(ln)
    ####################################
    readme.append('\n')
    readme.append('## Functions')
    readme.append('\n')
    readme.append('| version | name | returns |')
    readme.append('| ------- | ------- | ------ |')
    lines = Util().getLines(folder, f)
    print(lines)
    funcs = [ln for ln in lines if re.search('[CREATE]+[ ]+[OR]+[ ]+[REPLACE]+[ ]+[FUNCTION]+', ln)]

    for ln in funcs:
        ln = '| {} |'.format( ln.strip()
                                  .replace('CREATE OR REPLACE FUNCTION', '')
                                  .replace('.',' | ')
                                  .replace('RETURNS', ' | ')
                                  .replace('\n', ''))

        readme.append(ln)
    ############################################
    readme.append('\n')
    readme.append('## Script Pattern')
    readme.append('\n')
    readme.append('| file | type | detail |')
    readme.append('| ---- | ------- | ------ |')

    lines = Util().getLines(folder, f)
    lines = [ln for ln in lines if re.search('[-]+[ ]+[A-Za-z]+[:]',ln)]
    for ln in lines:
        ln = '| {} | {} |'.format(f , ln.strip().replace('-- ','').replace(': ', ' | ').replace('\n',''))
        readme.append(ln)

    #########################################

    # Permissions
    lines = Util().getLines(folder, f)
    lines = [ln for ln in lines if re.search('[g][r][a][n][t]+[ ]', ln)]
    if len(lines) > 0:
        readme.append('\n')
        readme.append('## Permissions')
        readme.append('\n')
        readme.append('| file | action | permission | on | to |')
        readme.append('| ---- | ------ | ---------- | ---- | ---- |')
        for ln in lines:
            ln = '| {} | {} |'.format(f,
                                      ln.strip()
                                      .replace('grant ', 'grant | ')
                                      .replace(' on ',' | ')
                                      .replace(' to ',' | ')
                                      .replace(';', ''))

            readme.append(ln)

for ln in readme:
    print(ln)

Util().writeLines(folder,outname,readme)
