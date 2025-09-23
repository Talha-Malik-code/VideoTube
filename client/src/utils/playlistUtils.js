// Utility functions for playlist operations

export const sortPlaylists = (playlists, sortBy) => {
  if (!playlists || !Array.isArray(playlists)) return [];

  const sortedPlaylists = [...playlists];

  switch (sortBy) {
    case "newest":
      return sortedPlaylists.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

    case "oldest":
      return sortedPlaylists.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

    case "name":
      return sortedPlaylists.sort((a, b) => a.name.localeCompare(b.name));

    case "videos":
      return sortedPlaylists.sort(
        (a, b) => (b.videos?.length || 0) - (a.videos?.length || 0)
      );

    case "views":
      return sortedPlaylists.sort((a, b) => {
        const aViews =
          a.videos?.reduce((sum, video) => sum + (video.views || 0), 0) || 0;
        const bViews =
          b.videos?.reduce((sum, video) => sum + (video.views || 0), 0) || 0;
        return bViews - aViews;
      });

    default:
      return sortedPlaylists;
  }
};

export const filterPlaylists = (playlists, filters = {}) => {
  if (!playlists || !Array.isArray(playlists)) return [];

  let filteredPlaylists = [...playlists];

  // Filter by search term
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filteredPlaylists = filteredPlaylists.filter(
      (playlist) =>
        playlist.name.toLowerCase().includes(searchLower) ||
        playlist.description.toLowerCase().includes(searchLower)
    );
  }

  // Filter by video count
  if (filters.minVideos !== undefined) {
    filteredPlaylists = filteredPlaylists.filter(
      (playlist) => (playlist.videos?.length || 0) >= filters.minVideos
    );
  }

  // Filter by date range
  if (filters.dateFrom) {
    filteredPlaylists = filteredPlaylists.filter(
      (playlist) => new Date(playlist.createdAt) >= new Date(filters.dateFrom)
    );
  }

  if (filters.dateTo) {
    filteredPlaylists = filteredPlaylists.filter(
      (playlist) => new Date(playlist.createdAt) <= new Date(filters.dateTo)
    );
  }

  return filteredPlaylists;
};

export const calculatePlaylistStats = (playlists) => {
  if (!playlists || !Array.isArray(playlists)) {
    return {
      totalPlaylists: 0,
      totalVideos: 0,
      totalViews: 0,
      averageVideosPerPlaylist: 0,
      averageViewsPerPlaylist: 0,
    };
  }

  const totalPlaylists = playlists.length;
  const totalVideos = playlists.reduce(
    (sum, playlist) => sum + (playlist.videos?.length || 0),
    0
  );
  const totalViews = playlists.reduce((sum, playlist) => {
    return (
      sum +
      playlist.videos.reduce(
        (videoSum, video) => videoSum + (video.views || 0),
        0
      )
    );
  }, 0);

  return {
    totalPlaylists,
    totalVideos,
    totalViews,
    averageVideosPerPlaylist:
      totalPlaylists > 0 ? (totalVideos / totalPlaylists).toFixed(1) : 0,
    averageViewsPerPlaylist:
      totalPlaylists > 0 ? (totalViews / totalPlaylists).toFixed(1) : 0,
  };
};

export const formatPlaylistDuration = (playlist) => {
  if (!playlist.videos || !Array.isArray(playlist.videos)) return "0:00";

  // This would need actual video duration data
  // For now, return a placeholder
  return `${playlist.videos.length} videos`;
};

export const getPlaylistThumbnail = (playlist) => {
  // If playlist has a custom thumbnail, use it
  if (playlist.thumbnail) {
    return playlist.thumbnail;
  }

  // Otherwise, use the first video's thumbnail
  if (
    playlist.videos &&
    playlist.videos.length > 0 &&
    playlist.videos[0].thumbnail
  ) {
    return playlist.videos[0].thumbnail;
  }

  // Fallback to default thumbnail

  // return "https://lh3.googleusercontent.com/rd-gg/AAHar4e_wQAPgnVynu13XvLluHzS5Z7FAlQY28isOjwVe90NQQ6Arv3QTnp_pqq3sDuu-6Z6k7kjkU67f1g76UY9DK6Crq_HJXvoeWyZQeP8AUyGPquLy8ISwRmKOxWvA9QLO_QHfHXao0WcFIMgrJvBRQvkskvrhdXFMBir0Yjw5cyFzKADCGUpFg1TjhZjKoJtZXLUihZd7yeePIkmgoKRdxl8FNUXQ_VZotu5W02PUles9D2MAEVXy2FfpMA617zZBO38c5Mi2F2cyiOlEMKHl5qoYzo-S2WAdtouJlyVVRF36xw8RFFMKXdMt4Lpmn1kTnW0BAusXzwdenpav2Ejbi6o5QHRlrrCKYnEcmYfieKJ3IheQQ9kjHE8_ISAovnMccdztTYTcq6ml8C9zwIBTsrFpR_S3VV6ACVYuDEK5FaCZwxXH2zfIMAzy_NWJBmGWSZdg4978axnbo45ITQVGMcPiiNwX90KdRp17esft8nzex8rhiNN_K59yLKivuIdY8EpCnI2dwjgivVjBSKHeRlQpxVaLzIRO_BFeCA89AdjW2MWw7BwyGDD5FTebT9qZ_cM1pRp4XpcwoY7GD3wdoXETXZYAAKd44BWyKY5SkrU07AjpzfJp3QOTdXHdlC9gvHzThRo8tXF2jVaLKw66LzqYKxDYs1xjdMtMjRy1huOX3Yg8boFLFHFsVZ8DDGnRicQUg6j-OXgjxwGmTsnI3NiaaxhUYEpNdGtnOYI44WmYOG6nwsVJfbnpWqXIDHMEnO-9aFRQ9JUXp0RAhLGxRuueJFUnwegddtTSq0hHkrJQlX5hOfhlfP0xI7i73scZ6AbI3qzaMNYukYbNtp1VpbipImC-W-baqTYIVU0Edm4JUBzXSgfA0Qv9Kviv-BuLgfVpW6qp6F2z12Y0uJAmFghB1LCOHDOtvrRhgO_I5JuHJTXzZSh9eG9Uzdh-XJGx5y0gXku8q-D0BS23U9NFotoqrQtbjlljyeK8r_ykl4BW-G-3wna0-NTtPt7JaqOv1_tBEkGnbxp7rSJQSG-sRyf216C1ZQQiywtGjmQ0tzTDbutqHj97R2rYpv9JeFfi-UDmhW0Z7qrt5U0NA3nK73qLnJuLItaS4J-Y1wct1ZO5taUiYCtVrVxfsug8U_fZz5IxSLEnTco1HcSh6dnl7PuFWi8Zj0IbQah4eDavPqcoE9ZH_siZmHIn-fC_HCql6l-6rsytyN-g8N-X-xi5eNJvRcDNFR8v9FdOj8evQzP7W3eHlrH4dr6VnmPzHGmXZ9Pn_7eORoys-y5NjOsvc3LSXlIo5rfspguK9yFYPNGlC25jv8ctEr7uflK2xSa3--sfpWDgBdI4n81MNEF3ximnmnU-vmGw8cwpj21_3rtwy49Cm9LQy4_8XOq7w=s1024";
  // return "https://lh3.googleusercontent.com/rd-gg/AAHar4c5tsaMTnQA58QLnV_AVevYjEqKBMMO2yxlJs5te9LfuqRNoVBzrnOAvzWrQikUsyGp2mOV6XS7HOGlnyf7Uik-ORExrIfX93W0VOD1pYI0Z_JqKHRQUZZTb05jbOTpz4WMkXhEL7TvGr3ikZGXbbQMWHZpMsRedTI5Fsh007BAtl5R1kgwqSXmKeMtJasL9q6_bBAfRb-tRNdupoXn6f9i0E8osJhz6uIxsUP1O5GXhbt8NaCIOcmnaixat1ITMLpyl1t-BX0klZNfm71DYNrjt4nSHTAKQpO3Ka37LZLF4lN3vDKpdBVqRB7DEZnUqM2XZB8HTa6JSeCNSZGKFBaNyWClLRxWZUdyazV_KgUeLI0V5U3mdkqXRETp8wlJqSlVeH7YfLarjOpB_QNhV4PmIlByntDPgkhovRYJHtKzqHWBnebvG1Cz3EuSaB_-KE6n_8e1tcQBKUZuaIIqe6pG49KqI_BVaFEyzzsNE56YVo6U7JqORt8avI--AzEJoXZySbD_3kGwYy3CIsBf9onsPGgCXnJKmH3bKQs4NuqzJOkL3i2ckmlUyv2hyEXnNNBGP3-yBK6o0mYp7ZASZ9lDknIBwimG_x6q1yZQ86U_p248BAgun50Aq6WjzZwgp7V-9046DcLDPNNA0851OBkIzKl9VPXy_rCT0be4KIAwCO8E5_6MKVLGc4nMNVUB2YEPKD1O96tjWgjkrxqzRmsx5g9qHeLdX7LWu8MrBhV-i2rn6y3tk-lkMci0Sie_b_uF18rN_4xLoZXDxD1hWOMs5J_nQZ6_aWnflkRENeUnanGe-CJCcBK_zR1gvB0O2-WTFA24esXFjE7R0ZVahi1-VyEjla4opbC24DFIwp_DfFZpPm9xHEemhmm7UPlOaJ2KGQVXCn8pXWR_ztBhRntWBpuDhy0FktkVS49I_gthBqZVT26GfS7JloaleTHcRr11xCN9KQW6pTjnTfMzbWfmK0K4BVftH2oAcu2aXZw0iHUfFTzhW1XjnvTnB-ZgZbFypQrCE-aPRQ-nOhr_e_U9SLiJPvL-sVukNl67ktm0mlktyCGSBzF8SZOzQRBGtlu1i-wdmtnm5zk6vv5jAacQe-xD-HKXMmwvykLGkcMRZGyqR3mdNHYntcWZa5ikTbmn93Mo79Un1Qip0HVxr7IWfNyT0JFtkvu9_sn7u_0pqPc1uPJ5l85CMKBnuNYCTM_Ld1pnYEIIm2j-Odp6K8eZbJ7ppTwXvE5Y5isCxyZkwgP453zMRPJuQHIT-TDNSFMMbDvBarkc-UJxOoRBaNzYKXEQVXKp3MfP3huUkqbq5-ej-g-VWheTKYfLRGIE8pdS9Rnau6PGpP6w1TaIYXuhJIYzknSWBWsorK1jQnZwxYaJVeSfjP_D7rcoAA=s1024";
  return "https://images.unsplash.com/photo-1694878982098-1cec80d96eca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMwNDd8MHwxfHNlYXJjaHw0fHx0aHVtYm5haWwlMkNkZWZhdWx0fGVufDB8fHx8MTc1ODM1MjY3NXww&ixlib=rb-4.1.0&q=80&w=1080";
  // return "https://images.unsplash.com/photo-1642761450221-cad688ceafe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMwNDd8MHwxfHNlYXJjaHw3fHxwbGF5bGlzdHRodW1ibmFpbCUyQ3B1cnBsZSUyQ2Rhcmt8ZW58MHx8fHwxNzU4MzUyMTUyfDA&ixlib=rb-4.1.0&q=80&w=1080";
  // return "https://images.unsplash.com/photo-1653549892808-aa48a0a18ee6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMwNDd8MHwxfHNlYXJjaHw0fHxwbGF5bGlzdHRodW1ibmFpbCUyQ3B1cnBsZSUyQ2Rhcmt8ZW58MHx8fHwxNzU4MzUyMTUyfDA&ixlib=rb-4.1.0&q=80&w=1080";
  // return "https://images.unsplash.com/photo-1653549892808-aa48a0a18ee6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMwNDd8MHwxfHNlYXJjaHw0fHxwbGF5bGlzdHRodW1ibmFpbCUyQ3B1cnBsZSUyQ2Rhcmt8ZW58MHx8fHwxNzU4MzUyMTUyfDA&ixlib=rb-4.1.0&q=80&w=400";
  // return "https://images.unsplash.com/photo-1653549892808-aa48a0a18ee6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MDMwNDd8MHwxfHNlYXJjaHw0fHxwbGF5bGlzdHRodW1ibmFpbCUyQ3B1cnBsZSUyQ2Rhcmt8ZW58MHx8fHwxNzU4MzUyMTUyfDA&ixlib=rb-4.1.0&q=80&w=200";
  // return "https://images.unsplash.com/photo-1653549892808-aa48a0a18ee6?ixid=M3w4MDMwNDd8MHwxfHNlYXJjaHw0fHxwbGF5bGlzdHRodW1ibmFpbCUyQ3B1cnBsZSUyQ2Rhcmt8ZW58MHx8fHwxNzU4MzUyMTUyfDA&ixlib=rb-4.1.0";
  // return "https://images.unsplash.com/photo-1728140161994-975b3f4fd93c?ixid=M3w4MDMwNDd8MHwxfHNlYXJjaHwxfHxwbGF5bGlzdCUyQ3RodW1ibmFpbCUyQ2NvbnRyYXN0fGVufDB8fHx8MTc1ODMxMTk3N3ww&ixlib=rb-4.1.0";
  // return "https://images.unsplash.com/photo-1655199798109-08ff7497e748?ixid=M3w4MDMwNDd8MHwxfHNlYXJjaHwxfHx2aWRlb3R1YmUlMkNwbGF5bGlzdCUyQ3RodW1ibmFpbCUyQ2NvbnRyYXN0fGVufDB8fHx8MTc1ODMxMTk2NXww&ixlib=rb-4.1.0";
  // return "https://images.unsplash.com/photo-1634155617372-69e7865ff131?ixid=M3w4MDMwNDd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NTgzMTE5MTl8&ixlib=rb-4.1.0";
  // return "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
};
