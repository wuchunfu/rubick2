import { createStore } from "vuex";
import request from "@/assets/request";

const isDownload = (item: any, targets: any[]) => {
  let isDownload = false;
  targets.some((plugin) => {
    if (plugin.name === item.name) {
      isDownload = true;
    }
    return isDownload;
  });
  return isDownload;
};

export default createStore({
  state: {
    totalPlugins: [],
    localPlugins: [],
  },
  mutations: {
    commonUpdate(state: any, payload) {
      Object.keys(payload).forEach((key) => {
        state[key] = payload[key];
      });
    },
  },
  actions: {
    async init({ commit }) {
      const totalPlugins = await request.getTotalPlugins();
      const localPlugins = (window as any).rubick.getLocalPlugins();

      totalPlugins.forEach(
        (origin: { isdwonload?: any; name?: any; isloading: boolean }) => {
          origin.isdwonload = isDownload(origin, localPlugins);
          origin.isloading = false;
        }
      );
      commit("commonUpdate", {
        localPlugins,
        totalPlugins,
      });
    },
    startDownload({ commit, state }, name) {
      const totalPlugins = JSON.parse(JSON.stringify(state.totalPlugins));
      totalPlugins.forEach(
        (origin: { isdwonload?: any; name?: any; isloading: boolean }) => {
          if (origin.name === name) {
            origin.isloading = true;
          }
        }
      );
      commit("commonUpdate", {
        totalPlugins,
      });
    },
    successDownload({ commit, state }, name) {
      const totalPlugins = JSON.parse(JSON.stringify(state.totalPlugins));
      totalPlugins.forEach(
        (origin: { isdwonload?: any; name?: any; isloading: boolean }) => {
          if (origin.name === name) {
            origin.isloading = false;
            origin.isdwonload = true;
          }
        }
      );
      const localPlugins = (window as any).rubick.getLocalPlugins();

      commit("commonUpdate", {
        totalPlugins,
        localPlugins,
      });
    },
    updateLocalPlugin({ commit }) {
      const localPlugins = (window as any).rubick.getLocalPlugins();
      commit("commonUpdate", {
        localPlugins,
      });
    },
  },
  modules: {},
});
