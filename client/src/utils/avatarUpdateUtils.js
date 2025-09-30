/**
 * Utility function to update user avatar across all cached data
 * This should be called whenever a user's avatar is updated
 *
 * @param {Object} dispatch - Redux dispatch function
 * @param {string} userId - The ID of the user whose avatar was updated
 * @param {string} newAvatar - The new avatar URL
 */
export const updateAvatarGlobally = (dispatch, userId, newAvatar) => {
  // Import the thunk dynamically to avoid circular dependencies
  import("../app/features/channelSlice").then(
    ({ updateUserAvatarGlobally }) => {
      dispatch(updateUserAvatarGlobally({ userId, newAvatar }));
    }
  );
};

/**
 * Example usage in a component:
 *
 * import { useDispatch } from 'react-redux';
 * import { updateAvatarGlobally } from '../utils/avatarUpdateUtils';
 *
 * const MyComponent = () => {
 *   const dispatch = useDispatch();
 *
 *   const handleAvatarUpdate = (newAvatarUrl) => {
 *     // Update avatar globally across all cached data
 *     updateAvatarGlobally(dispatch, currentUserId, newAvatarUrl);
 *   };
 *
 *   return (
 *     // Your component JSX
 *   );
 * };
 */
