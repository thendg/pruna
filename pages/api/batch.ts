/* receives a address of a reference file in IPFS, return a json in the format:
{
    "batch": [
        "file1",
        "file2",
        "folder/file3"
    ]
}
*/
import { Web3Storage } from 'web3.storage'

function getAccessToken () {
  // If you're just testing, you can paste in a token
  // and uncomment the following line:
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDc1MDhCMkI0NTliRGZmRThDYmU5NWYwMkNENDUyQzAxNmNCMzRCNUYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njk0ODk0ODU3OTMsIm5hbWUiOiJnZW5lcmFsIn0.8h1YCC0XgazDE8h0xgQLS4lCSoNTe2YeHpCYX7mNlDM'

  // In a real app, it's better to read an access token from an
  // environement variable or other configuration that's kept outside of
  // your code base. For this to work, you need to set the
  // WEB3STORAGE_TOKEN environment variable before you run your code.
  //return process.env.WEB3STORAGE_TOKEN
}

function makeStorageClient () {
  return new Web3Storage({ token: getAccessToken() })
}

async function retrieve (cid: string) {
  const client = makeStorageClient()
  const res = await client.get(cid)
  if (res){
    console.log(`Got a response! [${res.status}] ${res.statusText}`)
    if (!res.ok) {
      throw new Error(`failed to get ${cid}`)
    }
  }

  // request succeeded! do something with the response object here...
}

async function retrieveFiles (cid: string) {
  const client = makeStorageClient()
  const res = await client.get(cid)
  if (res){
    console.log(`Got a response! [${res.status}] ${res.statusText}`)
    if (!res.ok) {
      throw new Error(`failed to get ${cid} - [${res.status}] ${res.statusText}`)
    }

    // unpack File objects from the response
    const files = await res.files()
    for (const file of files) {
      console.log(`${file.cid} -- ${file.name} -- ${file.size}`)
    }
  }
}