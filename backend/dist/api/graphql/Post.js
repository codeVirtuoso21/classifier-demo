"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostMutation = exports.PostQuery = exports.Post = exports.Song = exports.Movie = exports.Media = void 0;
const nexus_1 = require("nexus");
exports.Media = nexus_1.interfaceType({
    name: 'Media',
    resolveType(source) {
        return 'director' in source ? 'Movie' : 'Song';
    },
    definition(t) {
        t.string('url');
    },
});
exports.Movie = nexus_1.objectType({
    name: 'Movie',
    definition(t) {
        t.implements('Media');
        t.string('director');
    },
});
exports.Song = nexus_1.objectType({
    name: 'Song',
    definition(t) {
        t.implements('Media');
        t.string('album');
    },
});
exports.Post = nexus_1.objectType({
    name: 'Post',
    definition(t) {
        t.int('id');
        t.string('title');
        t.string('body');
        t.boolean('published');
    },
});
exports.PostQuery = nexus_1.extendType({
    type: 'Query',
    definition(t) {
        t.list.field('drafts', {
            type: 'Post',
            resolve(_root, _args, ctx) {
                return ctx.db.post.findMany({ where: { published: false } });
            },
        });
        t.list.field('posts', {
            type: 'Post',
            resolve(_root, _args, ctx) {
                return ctx.db.post.findMany({ where: { published: true } });
            },
        });
    },
});
exports.PostMutation = nexus_1.extendType({
    type: 'Mutation',
    definition(t) {
        t.field('createDraft', {
            type: 'Post',
            args: {
                title: nexus_1.nonNull(nexus_1.stringArg()),
                body: nexus_1.nonNull(nexus_1.stringArg()),
            },
            resolve(_root, args, ctx) {
                const draft = {
                    title: args.title,
                    body: args.body,
                    published: false,
                };
                return ctx.db.post.create({ data: draft });
            },
        });
        t.field('publish', {
            type: 'Post',
            args: {
                draftId: nexus_1.nonNull(nexus_1.intArg()),
            },
            resolve(_root, args, ctx) {
                return ctx.db.post.update({
                    where: {
                        id: args.draftId,
                    },
                    data: {
                        published: true,
                    },
                });
            },
        });
    },
});
//# sourceMappingURL=Post.js.map