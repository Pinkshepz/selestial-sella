import { google } from 'googleapis';

function dataProcessing(_data: Array<Array<any>>): {[key: string]: {[key: string]: any}} {
    // Convert array of data from spreadsheet into object
    // Input:
    // [ [ID, h1, h2, h3, h4, h5],
    //   [A1, a , b , true , d , e],
    //   [A2, 1 , 2 ,      , 4 , 5] ]
    //
    // Output
    // { A1: {ID:A1, h1: a, h2: b, h3: true, h4: d, h5: e}
    //   A2: {ID:A2, h1: 1, h2: 2, h3: null, h4: 4, h5: 5} }
    //
    // Restriction: first row must be header

    // Store new array
    let _new_data: {[key: string]: {[key: string]: any}} = {};
    // Pick header row out
    const _headers: Array<string> = _data.shift()!;

    // Then, process each row of data
    for (let i = 0; i < _data.length; i++) {
        // Temp store object, reset value
        let _datarow_obj: {[key: string]: any} = {};
        
        // Process each element
        for (let j = 0; j < _headers.length; j++) {
            _datarow_obj[_headers[j]] = _data[i][j];
        }

        // When every element is processed, push newly created object into new array
        if ((_data[i][0] != '') && (_data[i][0] != undefined)) {
            _new_data[_data[i][0]] = _datarow_obj
        };
    }

    return _new_data;
}

async function getServerSideProps({
    id,
    ref,
    sheetName,
    rangeName
}: { 
    id: string | null,
    ref: string,
    sheetName: string,
    rangeName: string
}) {
    // Function for fetching server-side data from GG Sheet api
    // Client auth:
        // Local: stores env. variables in .env.local
        // Vercel: stores env. variables in project own env variables
    const auth = await google.auth.getClient({
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        credentials: {
            private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n') + '\n',
            client_email: process.env.GOOGLE_CLIENT_EMAIL
        }
    });

    const sheets = google.sheets({ version: 'v4', auth });
  
    // Query
    const range = `${sheetName}!${rangeName}`;

    if (id === null) {id = process.env.SHEET_ID!}
  
    // Fetch data & error handling
    try {
        // Fetch data from GG Sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: id,
            range
        });

        // Result: array of each sheet's row data
        const data = response.data.values;
        
        // Show data status
        console.log(`-----API 200 - OK AT ${ref}-----`);
        return dataProcessing(data!);

    } catch (error) {
        // If sheet doesn't exist, show status
        console.log(`-----API 404 - NOT FOUND AT ${ref}-----`);
        return undefined;
    }
}

// Export function
export function getGoogleSheetProps({
    id,
    ref,
    sheetName,
    rangeName
}: { 
    id: string | null,
    ref: string,
    sheetName: string,
    rangeName: string
}) {
    return getServerSideProps({id, sheetName, rangeName, ref});
}
