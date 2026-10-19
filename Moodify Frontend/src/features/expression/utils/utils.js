import {
    FaceLandmarker,
    FilesetResolver
} from "@mediapipe/tasks-vision";

export const init = async ({ landmarkerRef, videoRef, streamRef }) => {
    try {
        // Reuse an active camera stream if one already exists.
        if (streamRef.current?.getVideoTracks().some(
            track => track.readyState === "live"
        )) {
            if (videoRef.current) {
                videoRef.current.srcObject = streamRef.current;
                await videoRef.current.play();
            }
            return;
        }

        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        landmarkerRef.current = await FaceLandmarker.createFromOptions(
            vision,
            {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
                },
                outputFaceBlendshapes: true,
                runningMode: "VIDEO",
                numFaces: 1
            }
        );

        streamRef.current =
            await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });

        if (!videoRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
            return;
        }

        videoRef.current.srcObject = streamRef.current;
        await videoRef.current.play();

    } catch (error) {
        console.error("Camera initialization failed:", error);

        // Release resources if initialization fails.
        streamRef.current?.getTracks().forEach(track => track.stop());
        streamRef.current = null;

        landmarkerRef.current?.close();
        landmarkerRef.current = null;

        throw error;
    }
};

export const cleanup = ({ landmarkerRef, videoRef, streamRef }) => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
    }

    landmarkerRef.current?.close();
    landmarkerRef.current = null;
};

export const detect = ({
    landmarkerRef,
    videoRef,
    setExpression
}) => {
    if (
        !landmarkerRef.current ||
        !videoRef.current ||
        videoRef.current.readyState < 2
    ) {
        return;
    }

    const results = landmarkerRef.current.detectForVideo(
        videoRef.current,
        performance.now()
    );

    let currentExpression = "Neutral";

    if (results.faceBlendshapes?.length > 0) {
        const blendshapes = results.faceBlendshapes[0].categories;

        const getScore = (name) =>
            blendshapes.find(b => b.categoryName === name)?.score || 0;

        const smileLeft = getScore("mouthSmileLeft");
        const smileRight = getScore("mouthSmileRight");
        const jawOpen = getScore("jawOpen");
        const browUp = getScore("browInnerUp");
        const frownLeft = getScore("mouthFrownLeft");
        const frownRight = getScore("mouthFrownRight");

        if (smileLeft > 0.5 && smileRight > 0.5) {
            currentExpression = "happy";
        } else if (jawOpen > 0.02 && browUp > 0.002) {
            currentExpression = "confused";
        } else if (frownLeft > 0.0001 && frownRight > 0.0001) {
            currentExpression = "sad";
        }

        setExpression(currentExpression);
    }

    return currentExpression;
};
