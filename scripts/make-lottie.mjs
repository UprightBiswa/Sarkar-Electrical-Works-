// Generates the small Lottie animations used on the site (src/lottie/*.json)
import { writeFileSync } from "node:fs";
const S = (v) => ({ a: 0, k: v });
const kf = (frames) => ({
  a: 1,
  k: frames.map(([t, s], i) =>
    i === frames.length - 1 ? { t, s } : { t, s, i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
  ),
});
const tr = () => ({ ty: "tr", p: S([0, 0]), a: S([0, 0]), s: S([100, 100]), r: S(0), o: S(100), sk: S(0), sa: S(0) });
const path = (pts, closed = true) => ({
  ty: "sh",
  ks: S({ i: pts.map(() => [0, 0]), o: pts.map(() => [0, 0]), v: pts, c: closed }),
});
const layer = (ind, nm, shapes, ks = {}) => ({
  ddd: 0, ind, ty: 4, nm, sr: 1, ao: 0, ip: 0, op: 60, st: 0, bm: 0,
  ks: { o: S(100), r: S(0), p: S([100, 100, 0]), a: S([100, 100, 0]), s: S([100, 100, 100]), ...ks },
  shapes,
});
const doc = (nm, layers, op = 60) => ({ v: "5.7.4", fr: 30, ip: 0, op, w: 200, h: 200, nm, ddd: 0, assets: [], layers });

const yellow = [0.98, 0.8, 0.08, 1];
const cyan = [0.13, 0.83, 0.93, 1];

const bolt = doc("bolt", [
  layer(1, "bolt", [{ ty: "gr", it: [path([[112, 22], [58, 108], [96, 108], [82, 178], [144, 86], [106, 86], [112, 22]]), { ty: "fl", c: S(yellow), o: S(100), r: 1 }, tr()] }], {
    s: kf([[0, [100, 100, 100]], [8, [112, 112, 100]], [16, [96, 96, 100]], [30, [104, 104, 100]], [60, [100, 100, 100]]]),
    o: kf([[0, [100]], [6, [55]], [9, [100]], [12, [70]], [15, [100]], [60, [100]]]),
  }),
  layer(2, "glow", [{ ty: "gr", it: [{ ty: "el", p: S([100, 100]), s: S([110, 110]) }, { ty: "fl", c: S(yellow), o: S(100), r: 1 }, tr()] }], {
    o: kf([[0, [18]], [15, [35]], [30, [14]], [45, [30]], [60, [18]]]),
  }),
  layer(3, "ring1", [{ ty: "gr", it: [{ ty: "el", p: S([100, 100]), s: S([120, 120]) }, { ty: "st", c: S(cyan), o: S(100), w: S(3), lc: 2, lj: 2 }, tr()] }], {
    s: kf([[0, [60, 60, 100]], [60, [160, 160, 100]]]),
    o: kf([[0, [90]], [60, [0]]]),
  }),
  layer(4, "ring2", [{ ty: "gr", it: [{ ty: "el", p: S([100, 100]), s: S([120, 120]) }, { ty: "st", c: S(yellow), o: S(100), w: S(2), lc: 2, lj: 2 }, tr()] }], {
    s: kf([[0, [110, 110, 100]], [30, [160, 160, 100]], [31, [60, 60, 100]], [60, [110, 110, 100]]]),
    o: kf([[0, [45]], [30, [0]], [31, [90]], [60, [45]]]),
  }),
]);

const green = [0.2, 0.83, 0.6, 1];
const success = doc("success", [
  layer(1, "check", [{ ty: "gr", it: [path([[64, 102], [90, 128], [138, 76]], false), { ty: "st", c: S(green), o: S(100), w: S(12), lc: 2, lj: 2 }, { ty: "tm", s: S(0), e: kf([[18, [0]], [38, [100]]]), o: S(0), m: 1 }, tr()] }]),
  layer(2, "circle", [{ ty: "gr", it: [{ ty: "el", p: S([100, 100]), s: S([150, 150]) }, { ty: "st", c: S(green), o: S(100), w: S(8), lc: 2, lj: 2 }, { ty: "tm", s: S(0), e: kf([[0, [0]], [24, [100]]]), o: S(0), m: 1 }, tr()] }]),
  layer(3, "burst", [{ ty: "gr", it: [{ ty: "el", p: S([100, 100]), s: S([150, 150]) }, { ty: "fl", c: S(green), o: S(100), r: 1 }, tr()] }], {
    s: kf([[20, [80, 80, 100]], [50, [130, 130, 100]]]),
    o: kf([[20, [30]], [50, [0]]]),
  }),
], 60);

writeFileSync("src/lottie/bolt.json", JSON.stringify(bolt));
writeFileSync("src/lottie/success.json", JSON.stringify(success));
console.log("lottie ok");
