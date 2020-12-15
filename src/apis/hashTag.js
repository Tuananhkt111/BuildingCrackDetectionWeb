import ApiHelper from './ApiHelper';
import urlConstants from '../util/urlConstants';

export const createHashTag = (tagName) => {
    const data = {
        "TagName": tagName,
        "IsDel": false
    };
    return ApiHelper.post(urlConstants.HASHTAG_URL, data);
};

export const getHashTags = (dataSearch) => {
    const data = {
        "sort": dataSearch.sortOrder,
        "search": dataSearch.tagName,
        "limit": dataSearch.limit,
        "offset": dataSearch.offset
    }
    return ApiHelper.get(urlConstants.HASHTAG_URL, {params: data});
};

export const getHashTagsCount = (dataSearch) => {
    const data = {
        "search": dataSearch.tagName
    }
    return ApiHelper.get(urlConstants.HASHTAG_URL + "/count", {params: data});
};

export const updateHashTag = (id, tagName) => {
    const data = {
        "HashTagId": id,
        "TagName": tagName
    };
    return ApiHelper.put(urlConstants.HASHTAG_URL, data);
};

export const deleteHashTag = (id) => {
    return ApiHelper.delete(urlConstants.HASHTAG_URL + "/" + id);
};

export default {
    createHashTag,
    getHashTags,
    updateHashTag,
    deleteHashTag,
    getHashTagsCount
};