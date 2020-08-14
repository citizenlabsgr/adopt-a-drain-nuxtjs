#################
# SCRIPT: Write Web ReadMe.md
#################
# set source folder relative to this file
# get list of files
# process .sql files
# pluck all lines with regex
# format as md table
# write to README.md in source file


from util import Util
import re

folder = '../aad-web/sql/'
outname = 'README.md'
## READ: Make list of file in a folder
files = Util().getFileList(folder, ext='sql')
files.sort()
## PROCESS: Read all files

readme = []

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


for ln in readme:
    print(ln)

Util().writeLines(folder,outname,readme)
