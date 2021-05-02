# GoogleDriveXLS2Calendar [![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)

Google apps script to import XLS in Google Drive to Google Calendar.
> :warning: It's **tailored to my XLS files**, and therefore it won't work for you without customizing.

## Installation
```
npm install -g @google/clasp
npm i
clasp login
clasp create
npm run build
npm run push
clasp open
```
Open the `config.ts` and adjust it.
Provide a Google Drive folderId and upload a new XLS to it.
1. Adjust the data extraction (dates and shiftType) from the sheet. See tests for extraction of data.
2. Adjust the mapping in the script to your needs. (date, shiftType) -> (title, time)

After deployment open select `pollChanges` in the google apps script console and run it. The script will ask for permissions for Google Drive API and Google Calendar API. When the permissions are granted there should be a new calendar created with all the events mapped.
Create trigger on pollChanges that runs every day so that a sync workflow is established.

## Info
The build transpiles typescript to a javascript file with all dependencies in it using rollupjs.
