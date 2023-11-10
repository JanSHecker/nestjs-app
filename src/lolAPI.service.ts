import { Injectable } from '@nestjs/common';
import axios from 'axios';
import https from 'https';
import { AllGameDataResponse } from './lolAPItypes';

@Injectable()
export class LolAPIService {
  BASE_URL = 'https://127.0.0.1:2999';
  ALL_GAME_DATA_ENDPOINT = '/liveclientdata/allgamedata';

  async getLolInput() {
    const allGameDataUrl = this.BASE_URL + this.ALL_GAME_DATA_ENDPOINT;
    const axiosInstance = axios.create({
      httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Ignore SSL certificate errors
    });
    const response = await axiosInstance.get(allGameDataUrl);
    const responseData = response.data as AllGameDataResponse;
    return responseData;
  }
}
