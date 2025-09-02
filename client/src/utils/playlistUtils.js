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
  return "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
};
