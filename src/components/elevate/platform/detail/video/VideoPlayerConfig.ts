export const DEFAULT_PLAYER_VARS = {
  autoplay: 1,
  controls: 1,
  modestbranding: 1,
  rel: 0,
  origin: window.location.origin,
  showinfo: 0,
  fs: 0,
  iv_load_policy: 3,
  disablekb: 1
};

export const CONTAINER_STYLES = {
  position: 'relative' as const,
  paddingTop: '56.25%', // 16:9 aspect ratio
  width: '100%',
  height: '100%'
};