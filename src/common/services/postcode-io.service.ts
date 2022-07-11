import {
  Injectable,
  HttpService,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostCodeIoService {
  private endpoint: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.endpoint = this.configService.get('POSTCODEIO_API_URL');
  }

  async getPostcode(postcode: string) {
    try {
      const response = await this.httpService
        .get(`${this.endpoint}/postcodes/${postcode}`)
        .toPromise();

      return response.data;
    } catch (error) {
      return null;
    }
  }

  async getOutcode(outcode: string) {
    try {
      const response = await this.httpService
        .get(`${this.endpoint}/outcodes/${outcode}`)
        .toPromise();

      return response.data;
    } catch (e) {
      return null;
    }
  }

  async validatePostCode(postcode: string) {
    try {
      const response = await this.getPostcode(postcode);

      if (!response) {
        throw new Error('Invalid postcode.');
      }

      if (response && response.status === HttpStatus.OK) {
        return true;
      }

      return false;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async validateOutcode(outcode: string) {
    try {
      const response = await this.getOutcode(outcode);

      if (!response) {
        throw new Error('Invalid outcode.');
      }

      if (response && response.status === HttpStatus.OK) {
        return true;
      }

      return false;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_FOUND);
    }
  }

  async getNearestOutcodesPostcodeLocation(
    outcode: string,
    radius = 5000,
    limit = 100,
  ) {
    try {
      const response = await this.httpService
        .get(
          `${this.endpoint}/outcodes/${outcode}/nearest`,
          {
            params: {
              radius,
              limit,
            },
          },
        )
        .toPromise();

      return response.data;
    } catch (e) {
      const errorObject = e.response.data;
      throw new HttpException(errorObject?.error, errorObject.status);
    }
  }

  async getNearestPostcodeLocaitons(
    postcode: string,
    radius = 500,
    limit = 100,
  ) {
    try {
      const response = await this.httpService
        .get(
          `${this.endpoint}/postcodes/${postcode}/nearest`,
          {
            params: {
              radius,
              limit,
            },
          },
        )
        .toPromise();

      return response.data;
    } catch (e) {
      const errorObject = e.response.data;
      throw new HttpException(errorObject?.error, errorObject.status);
    }
  }

  async getLatLong(postcode): Promise<{ status: number, result: { latitude: number, longitude: number } }> {
    let response = null;

    if (postcode.length === 3 || postcode.length === 4) {
      // const outcodeValid = await this.
      response = await this.getOutcode(postcode);
    } else {
      response = await this.getPostcode(postcode);
    }

    return response;
  }
}
