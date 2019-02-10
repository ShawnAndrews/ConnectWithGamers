const express = require("express");
import { Request, Response } from "express";
const router = express.Router();
import { GenericModelResponse, ChatroomEmotesResponse, ChatroomEmote } from "../../client/client-server-common/common";
import routeModel from "../../models/routemodel";
import { chatroomModel } from "../../models/db/chatroom/main";
import { securityModel, SecurityCacheEnum } from "../../models/db/security/main";

export const routes = new routeModel();

/* routes */
routes.addRoute("emotes/get", "/emotes/get");
routes.addRoute("emote/upload", "/emote/upload");
routes.addRoute("emote/delete", "/emote/delete");
// routes.addRoute("attachment/upload", "/attachment/upload");

router.post(routes.getRoute("emotes/get"), (req: Request, res: Response) => {
    const chatroomEmotesResponse: ChatroomEmotesResponse = { error: undefined };
    chatroomModel.getEmotes()
    .then((emotes: ChatroomEmote[]) => {
        chatroomEmotesResponse.emotes = emotes;
        return res
        .send(chatroomEmotesResponse);
    })
    .catch((error: string) => {
        chatroomEmotesResponse.error = error;
        return res
        .send(chatroomEmotesResponse);
    });

});

router.post(routes.getRoute("emote/upload"), (req: Request, res: Response) => {
    const chatroomEmoteUploadResponse: GenericModelResponse = { error: undefined, data: undefined };
    const imageBase64: string = req.body.emoteBase64.split(",")[1];
    const fileExtension: string = req.body.fileExtension;
    const emotePrefix: string = req.body.emotePrefix;
    const emoteSuffix: string = req.body.emoteSuffix;
    const emoteUid: string = emotePrefix.concat(emoteSuffix);

    securityModel.uploadImage(imageBase64, SecurityCacheEnum.emote, fileExtension, emoteUid)
    .then(() => {
        return chatroomModel.uploadChatEmote(emotePrefix, emoteSuffix, fileExtension);
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

router.post(routes.getRoute("emote/delete"), (req: Request, res: Response) => {
    const chatroomEmoteDeleteResponse: GenericModelResponse = { error: undefined, data: undefined };
    const emotePrefix: string = req.body.emotePrefix;
    const emoteSuffix: string = req.body.emoteSuffix;

    chatroomModel.deleteChatEmote(emotePrefix, emoteSuffix)
    .then(() => {
        return res
        .send(chatroomEmoteDeleteResponse);
    })
    .catch((error: string) => {
        chatroomEmoteDeleteResponse.error = error;
        return res
        .send(chatroomEmoteDeleteResponse);
    });

});

export { router };