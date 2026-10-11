import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { useCloudHeroEnvironment } from "@/components/cloud-content-dialog/useCloudHeroEnvironment.js";
import { loadCloudLottieData } from "@/components/cloud-content-dialog/cloudLottieRuntime.js";
export function CloudImage({ hero }) {
    const { dark } = useCloudHeroEnvironment();
    const src = dark && hero.darkSrc ? hero.darkSrc : hero.src;
    return _jsx(ImageResource, { hero: hero, src: src }, src);
}
function ImageResource({ hero, src }) {
    const [status, setStatus] = useState("loading");
    return (_jsx("div", { className: "size-full bg-surface", "data-testid": "cloud-dialog-image-hero", "data-status": status, children: status === "error" ? (_jsx("div", { role: "img", "aria-label": hero.alt, className: "size-full" })) : (_jsx("img", { src: src, alt: hero.alt, referrerPolicy: "no-referrer", onLoad: () => setStatus("ready"), onError: () => setStatus("error"), className: `size-full ${hero.fit === "contain" ? "object-contain" : "object-cover"}` })) }));
}
export function CloudVideo({ hero, title, presentation = false, }) {
    const environment = useCloudHeroEnvironment();
    const src = environment.dark && hero.darkSrc ? hero.darkSrc : hero.src;
    return (_jsx(VideoResource, { hero: hero, src: src, title: title, animate: environment.animate, presentation: presentation }, src));
}
function VideoResource({ hero, src, title, animate, presentation, }) {
    const ref = useRef(null);
    const [failed, setFailed] = useState(false);
    useEffect(() => {
        const video = ref.current;
        if (!video)
            return;
        if (animate && hero.autoplay)
            void video.play().catch(() => { });
        else
            video.pause();
        return () => video.pause();
    }, [animate, hero.autoplay]);
    if (failed)
        return _jsx(CloudImage, { hero: { type: "image", src: hero.poster, alt: title, fit: hero.fit } });
    return (_jsx("video", { ref: ref, src: src, poster: hero.poster, muted: true, playsInline: true, controls: !presentation, tabIndex: presentation ? -1 : undefined, loop: hero.loop, autoPlay: Boolean(hero.autoplay && animate), preload: "metadata", "aria-label": title, "data-testid": "cloud-dialog-video-hero", onError: () => setFailed(true), className: `size-full ${hero.fit === "contain" ? "object-contain" : "object-cover"}` }));
}
export function CloudLottie({ hero, title }) {
    const environment = useCloudHeroEnvironment();
    const src = environment.dark && hero.darkSrc ? hero.darkSrc : hero.src;
    return (_jsx(LottieResource, { hero: hero, src: src, title: title, animate: environment.animate }, `${src}:${hero.loop}:${hero.speed}`));
}
function LottieResource({ hero, src, title, animate, }) {
    const container = useRef(null);
    const animation = useRef(null);
    const playback = useRef({ animate, autoplay: hero.autoplay });
    playback.current = { animate, autoplay: hero.autoplay };
    const [status, setStatus] = useState("loading");
    useEffect(() => {
        const controller = new AbortController();
        let item;
        const destroy = () => {
            item?.destroy();
            item = undefined;
            animation.current = null;
        };
        const timer = window.setTimeout(() => {
            controller.abort();
            destroy();
            setStatus("error");
        }, 10_000);
        void Promise.all([
            import("lottie-web/build/player/lottie_light_canvas.js"),
            loadCloudLottieData(src, controller.signal),
        ])
            .then(([module, data]) => {
            if (controller.signal.aborted || !container.current)
                return;
            item = module.default.loadAnimation({
                container: container.current,
                renderer: "canvas",
                autoplay: false,
                loop: hero.loop ?? false,
                animationData: data,
            });
            animation.current = item;
            item.setSpeed(Math.max(0.1, Math.min(4, hero.speed ?? 1)));
            const ready = () => {
                window.clearTimeout(timer);
                if (!controller.signal.aborted)
                    setStatus("ready");
            };
            const fail = () => {
                window.clearTimeout(timer);
                destroy();
                if (!controller.signal.aborted)
                    setStatus("error");
            };
            item.addEventListener("DOMLoaded", ready);
            item.addEventListener("data_failed", fail);
            item.addEventListener("error", fail);
            if (item.isLoaded)
                ready();
            if (playback.current.animate && playback.current.autoplay)
                item.play();
            else
                item.goToAndStop(0, true);
        })
            .catch(() => {
            destroy();
            if (!controller.signal.aborted)
                setStatus("error");
            window.clearTimeout(timer);
        });
        return () => {
            controller.abort();
            window.clearTimeout(timer);
            destroy();
        };
    }, [src, hero.loop, hero.speed]);
    useEffect(() => {
        if (animate && hero.autoplay)
            animation.current?.play();
        else
            animation.current?.pause();
    }, [animate, hero.autoplay]);
    if (status === "error" && hero.fallback)
        return _jsx(CloudImage, { hero: hero.fallback });
    return (_jsx("div", { ref: container, className: "size-full", role: "img", "aria-label": title, "data-testid": "cloud-dialog-lottie-hero", "data-status": status }));
}
//# sourceMappingURL=CloudDialogMediaHero.js.map