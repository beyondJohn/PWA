import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FileUploadService {

  constructor(
    private _httpClient: HttpClient
  ) { }
  postFile(fileToUpload: File) {
    const endpoint = 'http://switchmagic.com:4111/api/files';
    let data = {"patientData": {
      "uid": "",
      "firstName": "",
      "lastName": "",
      "gender": "Not Specified",
      "dateOfBirth": ""
    }}
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    formData.append("data", JSON.stringify(data));
    return this._httpClient.post(endpoint, formData);
      
  }

}