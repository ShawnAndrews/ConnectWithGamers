const socketIO = require("socket.io");
const express = require("express");
const router = express.Router();
import { GenericResponseModel, DbChatroomEmotesResponse, DbChatroomUploadEmoteResponse, DbAuthorizeResponse, DbChatroomUploadImageResponse, ChatroomUploadImageResponse, ChatroomEmotesResponse } from "../../client/client-server-common/common";
import routeModel from "../../models/routemodel";
import { securityModel } from "../../models/db/security/main";
import { chatroomModel } from "../../models/db/chatroom/main";

const routes = new routeModel();

/* routes */
routes.addRoute("emote/upload", "/emote/upload");
routes.addRoute("attachment/upload", "/attachment/upload");
routes.addRoute("emotes/get", "/emotes/get");

router.post(routes.getRoute("emotes/get"), (req: any, res: any) => {
    const chatroomEmotesResponse: ChatroomEmotesResponse = { error: undefined };
    chatroomModel.getEmotes()
    .then((response: DbChatroomEmotesResponse) => {
        chatroomEmotesResponse.emotes = response.emotes;
        return res
        .send(chatroomEmotesResponse);
    })
    .catch((error: string) => {
        chatroomEmotesResponse.error = error;
        return res
        .send(chatroomEmotesResponse);
    });

});

router.post(routes.getRoute("emote/upload"), (req: any, res: any) => {
    const chatroomEmoteUploadResponse: GenericResponseModel = { error: undefined, data: undefined };
    const imageBase64: string = req.body.emoteBase64.split(",")[1];
    const emotePrefix: string = req.body.emotePrefix;
    const emoteSuffix: string = req.body.emoteSuffix;

    chatroomModel.uploadImage(imageBase64)
    .then((response: DbChatroomUploadEmoteResponse) => {
        const emoteURL: string = response.link;
        return chatroomModel.uploadChatEmote(emoteURL, emotePrefix, emoteSuffix);
    })
    .then(() => {
        return res
        .send(chatroomEmoteUploadResponse);
    })
    .catch((error: string) => {
        chatroomEmoteUploadResponse.error = error;
        return res
        .send(chatroomEmoteUploadResponse);
    });

});

router.post(routes.getRoute("attachment/upload"), (req: any, res: any) => {
    const chatroomAttachmentResponse: ChatroomUploadImageResponse = { error: undefined };
    const imageBase64: string = Object.keys(req.body)[0].split(",")[1];

    // authorize
    securityModel.authorize(req.headers.cookie)
    .then((response: DbAuthorizeResponse) => {
        return chatroomModel.uploadImage(imageBase64);
    })
    .then((response: DbChatroomUploadImageResponse) => {
        chatroomAttachmentResponse.link = response.link;
        return res
        .send(chatroomAttachmentResponse);
    })
    .catch((error: string) => {
        chatroomAttachmentResponse.error = error;
        return res
        .send(chatroomAttachmentResponse);
    });

});

export { router };