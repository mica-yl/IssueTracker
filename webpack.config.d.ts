export type Build = {
  type: 'server' | 'client',
};

type wepbackEnv = {
  production: boolean,
  /**
   * use to build in memory.
   */
  inMem: boolean,
  type: Build.type,
};
