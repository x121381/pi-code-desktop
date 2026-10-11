import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useRef, useState } from "react";
import { ImagePreviewDialog } from "@/components/ai-elements/image-preview-dialog.js";
import { ImageThumbnailGallery, imageThumbnailClassName, imageThumbnailTriggerClassName, } from "@/components/ai-elements/image-thumbnail-gallery.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
export function NodeReplImageGrid({ images, resultImageLabel, }) {
    const { intl } = useZCodeIntl();
    const [previewIndex, setPreviewIndex] = useState(0);
    const [previewOpen, setPreviewOpen] = useState(false);
    const triggerRefs = useRef([]);
    const previewItems = useMemo(() => images.map((image, index) => ({
        alt: `${resultImageLabel} ${index + 1}`,
        filename: `result-image-${index + 1}`,
        src: `data:${image.mimeType};base64,${image.base64}`,
    })), [images, resultImageLabel]);
    const openImageLabel = intl.formatMessage({
        id: "chat.attachments.preview.open",
    });
    const handleOpenChange = (open) => {
        setPreviewOpen(open);
        if (!open) {
            window.setTimeout(() => triggerRefs.current[previewIndex]?.focus(), 0);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(ImageThumbnailGallery, { "data-node-repl-image-gallery": "", grouped: previewItems.length >= 2, children: previewItems.map((item, index) => (_jsx("button", { ref: (node) => {
                        triggerRefs.current[index] = node;
                    }, type: "button", "aria-label": `${openImageLabel} ${index + 1}`, className: imageThumbnailTriggerClassName, "data-image-thumbnail-trigger": "", onClick: () => {
                        setPreviewIndex(index);
                        setPreviewOpen(true);
                    }, children: _jsx("img", { alt: item.alt, className: imageThumbnailClassName, draggable: false, loading: "lazy", src: item.src }) }, `${images[index]?.mimeType}:${images[index]?.base64.length}:${index}`))) }), _jsx(ImagePreviewDialog, { dialogTestId: "node-repl-image-lightbox", imageTestId: "node-repl-image-lightbox-image", initialIndex: previewIndex, items: previewItems, onOpenChange: handleOpenChange, open: previewOpen })] }));
}
//# sourceMappingURL=nodeReplImageGrid.js.map