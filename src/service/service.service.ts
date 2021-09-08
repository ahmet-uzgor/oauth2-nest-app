import { Injectable } from '@nestjs/common';
import { GiphyFetch } from '@giphy/js-fetch-api';
import nodeFetch from 'node-fetch';
import fetch from 'node-fetch';
import { createApi } from 'unsplash-js';

global.fetch = fetch;

@Injectable()
export class ServiceService {
  async unsplashSearch(query, page, perPage) {
    const api = createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY,
      fetch: nodeFetch,
    });
    const response = (
      await api.search.getPhotos({
        query,
        // page,
        perPage,
        orderBy: 'relevant',
      })
    )['response'];
    const { results } = response;
    return await this.reformatUnsplashResponse(results);
  }

  async reformatUnsplashResponse(results) {
    const data = results.map((result) => {
      return {
        id: result.id,
        description: result.alt_description,
        url: result.urls['full'],
        user: result.user['name'],
      };
    });
    return data;
  }

  async getRandomFromUnsplash(count) {
    const api = createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY,
      fetch: nodeFetch,
    });
    const response = (await api.photos.getRandom({ count }))['response'];
    return await this.reformatUnsplashResponse(response);
  }

  async reformatGiphyResponse(gifs) {
    const data = gifs.map((gif) => {
      return {
        id: gif.id,
        title: gif.title,
        username: gif.username,
        url: gif.url,
        embedUrl: gif.embed_url,
      };
    });
    return data;
  }

  async getGiphyTrends(limit) {
    const gf = new GiphyFetch(process.env.GIPHY_ACCESS_KEY);
    const { data: gifs } = await gf.trending({
      limit,
      offset: 25,
      rating: 'g',
    });

    return await this.reformatGiphyResponse(gifs);
  }

  async giphySearch(query, limit) {
    const gf = new GiphyFetch(process.env.GIPHY_ACCESS_KEY);
    const { data: gifs } = await gf.search(query, {
      sort: 'relevant',
      lang: 'en',
      limit,
      type: 'gifs',
    });
    return await this.reformatGiphyResponse(gifs);
  }
}
