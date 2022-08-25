/* eslint-disable */
// @generated by protobuf-ts 2.7.0 with parameter long_type_string,generate_dependencies,client_generic,server_none,eslint_disable
// @generated from protobuf file "broadcast_v1/broadcast.proto" (package "stream.video.broadcast_v1", syntax proto3)
// tslint:disable
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MESSAGE_TYPE } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message stream.video.broadcast_v1.Latency
 */
export interface Latency {
    /**
     * @generated from protobuf field: repeated float measurements_seconds = 1;
     */
    measurementsSeconds: number[];
}
/**
 * @generated from protobuf message stream.video.broadcast_v1.RTMPOptions
 */
export interface RTMPOptions {
    /**
     * @generated from protobuf field: repeated string urls = 1;
     */
    urls: string[];
}
/**
 * @generated from protobuf message stream.video.broadcast_v1.Broadcast
 */
export interface Broadcast {
    /**
     * @generated from protobuf field: stream.video.broadcast_v1.RTMPOptions rtmp = 1;
     */
    rtmp?: RTMPOptions;
    /**
     * @generated from protobuf field: string hls_url = 2;
     */
    hlsUrl: string;
}
/**
 * @generated from protobuf enum stream.video.broadcast_v1.Codec
 */
export enum Codec {
    /**
     * @generated from protobuf enum value: CODEC_H264_UNSPECIFIED = 0;
     */
    H264_UNSPECIFIED = 0,
    /**
     * @generated from protobuf enum value: CODEC_VP8 = 1;
     */
    VP8 = 1,
    /**
     * @generated from protobuf enum value: CODEC_VP9 = 2;
     */
    VP9 = 2
}
// @generated message type with reflection information, may provide speed optimized methods
class Latency$Type extends MessageType<Latency> {
    constructor() {
        super("stream.video.broadcast_v1.Latency", [
            { no: 1, name: "measurements_seconds", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 2 /*ScalarType.FLOAT*/ }
        ]);
    }
    create(value?: PartialMessage<Latency>): Latency {
        const message = { measurementsSeconds: [] };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Latency>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Latency): Latency {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated float measurements_seconds */ 1:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.measurementsSeconds.push(reader.float());
                    else
                        message.measurementsSeconds.push(reader.float());
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: Latency, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* repeated float measurements_seconds = 1; */
        if (message.measurementsSeconds.length) {
            writer.tag(1, WireType.LengthDelimited).fork();
            for (let i = 0; i < message.measurementsSeconds.length; i++)
                writer.float(message.measurementsSeconds[i]);
            writer.join();
        }
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message stream.video.broadcast_v1.Latency
 */
export const Latency = new Latency$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RTMPOptions$Type extends MessageType<RTMPOptions> {
    constructor() {
        super("stream.video.broadcast_v1.RTMPOptions", [
            { no: 1, name: "urls", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<RTMPOptions>): RTMPOptions {
        const message = { urls: [] };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<RTMPOptions>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RTMPOptions): RTMPOptions {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated string urls */ 1:
                    message.urls.push(reader.string());
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: RTMPOptions, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* repeated string urls = 1; */
        for (let i = 0; i < message.urls.length; i++)
            writer.tag(1, WireType.LengthDelimited).string(message.urls[i]);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message stream.video.broadcast_v1.RTMPOptions
 */
export const RTMPOptions = new RTMPOptions$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Broadcast$Type extends MessageType<Broadcast> {
    constructor() {
        super("stream.video.broadcast_v1.Broadcast", [
            { no: 1, name: "rtmp", kind: "message", T: () => RTMPOptions },
            { no: 2, name: "hls_url", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<Broadcast>): Broadcast {
        const message = { hlsUrl: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Broadcast>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Broadcast): Broadcast {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* stream.video.broadcast_v1.RTMPOptions rtmp */ 1:
                    message.rtmp = RTMPOptions.internalBinaryRead(reader, reader.uint32(), options, message.rtmp);
                    break;
                case /* string hls_url */ 2:
                    message.hlsUrl = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: Broadcast, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* stream.video.broadcast_v1.RTMPOptions rtmp = 1; */
        if (message.rtmp)
            RTMPOptions.internalBinaryWrite(message.rtmp, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* string hls_url = 2; */
        if (message.hlsUrl !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.hlsUrl);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message stream.video.broadcast_v1.Broadcast
 */
export const Broadcast = new Broadcast$Type();
