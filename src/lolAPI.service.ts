import { Injectable } from '@nestjs/common';
import axios from 'axios';
import https from 'https';
import { AllGameDataResponse } from './lolAPItypes';
import fs, { readFileSync } from 'fs';

@Injectable()
export class LolAPIService {
  BASE_URL = 'https://127.0.0.1:2999';
  ALL_GAME_DATA_ENDPOINT = '/liveclientdata/allgamedata';
  LOL_INPUT_PATH = './lolInput.json';
  async getLolInput() {
    const allGameDataUrl = this.BASE_URL + this.ALL_GAME_DATA_ENDPOINT;
    const axiosInstance = axios.create({
      httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Ignore SSL certificate errors
    });
    const response = await axiosInstance.get(allGameDataUrl);
    const responseData = response.data as AllGameDataResponse;
    return responseData;
  }

  saveLolInput(input) {
    const inputJSON = JSON.stringify(input, null, 2);
    fs.writeFile(this.LOL_INPUT_PATH, inputJSON, 'utf8', (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
      } else {
        console.log('JSON file saved successfully!');
      }
    });
  }
  async readLolInput(): Promise<AllGameDataResponse> {
    const data = JSON.parse(
      fs.readFileSync(this.LOL_INPUT_PATH, 'utf-8'),
    ) as AllGameDataResponse;
    return data;
  }
}
