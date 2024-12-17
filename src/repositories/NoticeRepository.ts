import { WsAPI } from '@wapl/core';

import { NoticeCreateDto } from '@/@types/DTO';

import { servicePath } from './API';

export class NoticeRepository {
  getNotices = async ({
    roomId,
    lastNoticeId,
    size,
  }: {
    roomId: number;
    lastNoticeId?: number;
    size?: number;
  }) => {
    // let url = `${urlPath()}/rooms/${roomId}/notices`;
    // if (lastNoticeId) url += `?lastNoticeId=${lastNoticeId}`;
    // if (size) url += `&size=${size}`;
    // try {
    //   const res = await API.get(url);
    //   return res;
    // } catch (error) {
    //   console.log(error);
    //   throw error;
    // }

    const serviceName = servicePath('notice', 'GetNotices');
    const requestBody = {
      roomId,
      lastNoticeId,
      size,
    };

    try {
      const res = await WsAPI.send(serviceName, requestBody);
      return {
        status: res?.header.statusCode,
        data: res?.body,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getNotice = async ({
    roomId,
    noticeId,
  }: {
    roomId: number;
    noticeId: number;
  }) => {
    // try {
    //   const res = await API.get(
    //     `${urlPath()}/rooms/${roomId}/notices/${noticeId}`,
    //   );
    //   return res;
    // } catch (error) {
    //   console.log(error);
    //   return false;
    // }

    const serviceName = servicePath('notice', 'GetNotice');
    const requestBody = {
      roomId,
      noticeId,
    };

    try {
      const res = await WsAPI.send(serviceName, requestBody);
      return {
        status: res?.header.statusCode,
        data: res?.body,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  createNotice = async ({
    roomId,
    noticeBody,
    isActive,
    roomName,
    nick,
    isVote,
    appId,
  }: {
    roomId: number;
    noticeBody: NoticeCreateDto;
    isActive: boolean;
    roomName: string;
    nick: string;
    isVote: boolean;
    appId: string;
  }) => {
    // try {
    //   const requestBody = {
    //     noticeBody,
    //     isActive,
    //     noticeType: isVote ? 48 : 32,
    //     roomName,
    //     nick,
    //     appId,
    //   };
    //   const res = await API.post(
    //     `${urlPath()}/rooms/${roomId}/notices`,
    //     requestBody,
    //   );
    //   return res;
    // } catch (error) {
    //   console.log(error);
    //   throw error;
    // }

    const serviceName = servicePath('notice', 'CreateNotice');
    const requestBody = {
      roomId,
      appId,
      nick,
      noticeBody,
      noticeType: isVote ? 48 : 32,
      roomName,
      isActive,
    };

    try {
      const res = await WsAPI.send(serviceName, requestBody);
      return {
        status: res?.header.statusCode,
        data: res?.body,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  updateNotice = async ({
    roomId,
    noticeId,
    noticeBody,
    isActive,
    roomName,
    nick,
    appId,
  }: {
    roomId: number;
    noticeId: number;
    noticeBody: NoticeCreateDto;
    isActive: boolean;
    roomName: string;
    nick: string;
    appId: string;
  }) => {
    // const requestBody = {
    //   noticeBody,
    //   isActive,
    //   roomName,
    //   nick,
    //   appId,
    // };
    // if (isAdmin) {
    //   try {
    //     const res = await API.put(
    //       `${urlPath()}/admin/rooms/${roomId}/notices/${noticeId}`,
    //       requestBody,
    //     );
    //     return res;
    //   } catch (error) {
    //     console.log(error);
    //     throw error;
    //   }
    // } else {
    //   try {
    //     const res = await API.put(
    //       `${urlPath()}/rooms/${roomId}/notices/${noticeId}`,
    //       requestBody,
    //     );
    //     return res;
    //   } catch (error) {
    //     console.log(error);
    //     throw error;
    //   }
    // }

    const serviceName = servicePath('notice', 'UpdateNotice');
    const requestBody = {
      roomId,
      noticeId,
      appId,
      nick,
      noticeBody,
      roomName,
      isActive,
    };

    try {
      const res = await WsAPI.send(serviceName, requestBody);
      return {
        status: res?.header.statusCode,
        data: res?.body,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  deleteNotice = async ({
    roomId,
    noticeId,
    appId,
  }: {
    roomId: number;
    noticeId: number;
    appId: string;
  }) => {
    // if (isAdmin) {
    //   try {
    //     const res = await API.delete(
    //       `${urlPath()}/admin/rooms/${roomId}/notices/${noticeId}`,
    //     );
    //     return res;
    //   } catch (error) {
    //     console.log(error);
    //     throw error;
    //   }
    // } else {
    //   try {
    //     const res = await API.delete(
    //       `${urlPath()}/rooms/${roomId}/notices/${noticeId}`,
    //     );
    //     return res;
    //   } catch (error) {
    //     console.log(error);
    //     throw error;
    //   }
    // }

    const serviceName = servicePath('notice', 'DeleteNotice');
    const requestBody = {
      roomId,
      noticeId,
      appId,
    };

    try {
      const res = await WsAPI.send(serviceName, requestBody);
      return {
        status: res?.header.statusCode,
        data: res?.body,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  pinNotice = async ({
    roomId,
    noticeId,
    roomName,
    nick,
    appId,
  }: {
    roomId: number;
    noticeId: number;
    roomName: string;
    nick: string;
    appId: string;
  }) => {
    // try {
    //   const requestBody = {
    //     roomName,
    //     nick,
    //     appId,
    //   };
    //   const res = await API.patch(
    //     `${urlPath()}/rooms/${roomId}/notices/${noticeId}`,
    //     requestBody,
    //   );
    //   return res;
    // } catch (error) {
    //   console.log(error);
    //   throw error;
    // }
    const serviceName = servicePath('notice', 'PinNotice');
    const requestBody = {
      roomId,
      noticeId,
      roomName,
      nick,
      appId,
    };

    try {
      const res = await WsAPI.send(serviceName, requestBody);
      return {
        status: res?.header.statusCode,
        data: res?.body,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getPinnedNotice = async ({ roomId }: { roomId: number }) => {
    const serviceName = servicePath('notice', 'GetPinnedNotice');
    const requestBody = {
      roomId,
    };

    try {
      const res = await WsAPI.send(serviceName, requestBody);
      return {
        status: res?.header.statusCode,
        data: res?.body,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getNoticesWithLimit = async ({
    roomId,
    lastNoticeId,
    size,
  }: {
    roomId: number;
    lastNoticeId: number | null;
    size: number;
  }) => {
    const serviceName = servicePath('notice', 'GetNoticesWithLimit');
    const requestBody = {
      roomId,
      lastNoticeId,
      size,
    };

    try {
      const res = await WsAPI.send(serviceName, requestBody);
      return {
        status: res?.header.statusCode,
        data: res?.body,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getTotalNoticeCount = async ({ roomId }: { roomId: number }) => {
    const serviceName = servicePath('notice', 'GetTotalNoticeCount');
    const requestBody = {
      roomId,
    };

    try {
      const res = await WsAPI.send(serviceName, requestBody);
      return {
        status: res?.header.statusCode,
        data: res?.body,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export const NoticeRepoImpl = new NoticeRepository();
