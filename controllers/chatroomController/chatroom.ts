const express = require("express");
import { Request, Response } from "express";
const router = express.Router();
import { GenericModelResponse, ChatroomUploadImageResponse, ChatroomEmotesResponse, ChatroomEmote } from "../../client/client-server-common/common";
import routeModel from "../../models/routemodel";
import { chatroomModel } from "../../models/db/chatroom/main";

export const routes = new routeModel();

/* routes */
routes.addRoute("emotes/get", "/emotes/get");
routes.addRoute("emote/upload", "/emote/upload");
routes.addRoute("emote/delete", "/emote/delete");
routes.addRoute("attachment/upload", "/attachment/upload");

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
    const emotePrefix: string = req.body.emotePrefix;
    const emoteSuffix: string = req.body.emoteSuffix;

    chatroomModel.uploadImage(imageBase64)
    .then((link: string) => {
        const emoteURL: string = link;
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

router.post(routes.getRoute("attachment/upload"), (req: Request, res: Response) => {
    const chatroomAttachmentResponse: ChatroomUploadImageResponse = { error: undefined };
    const imageBase64: string = Object.keys(req.body)[0].split(",")[1];

    chatroomModel.uploadImage(imageBase64)
    .then((link: string) => {
        chatroomAttachmentResponse.link = link;
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