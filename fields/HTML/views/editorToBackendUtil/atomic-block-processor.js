import _ from 'lodash'
// import sizeOf from 'image-size';
import ApiDataInstance from './api-data-instance'
import ENTITY from './entities'
// import htmlparser2 from 'htmlparser2'
const htmlparser2 = require('htmlparser2')

const processor = {
    convertBlock(entityMap, block) {
        let alignment = 'center'
        let content
        let entityRange = block.entityRanges[0]
        let styles = {}
        // current block's entity data
        // ex:
        // entity.type = IMAGE, entity.data={id,name,url...}
        const entity = entityMap[entityRange.key]

        let type = _.get(entity, 'type', '')

        // backward compatible. Old entity type might be lower case
        switch (type && type.toUpperCase()) {
            case ENTITY.BLOCKQUOTE.type:
                // this is different from default blockquote of draftjs
                // so we name our specific blockquote as 'quoteby'
                type = 'quoteby'
                alignment = (entity.data && entity.data.alignment) || alignment
                content = _.get(entity, 'data')
                content = Array.isArray(content) ? content : [content]
                break
            case ENTITY.AUDIO.type:
            case ENTITY.IMAGE.type:
            case ENTITY.IMAGEDIFF.type:
            case ENTITY.INFOBOX.type:
            case ENTITY.SLIDESHOW.type:
            case ENTITY.VIDEO.type:
            case ENTITY.YOUTUBE.type:
                alignment = (entity.data && entity.data.alignment) || alignment
                content = _.get(entity, 'data')
                content = Array.isArray(content) ? content : [content]
                break
            case ENTITY.IMAGELINK.type:
                // use Embedded component to dangerouslySetInnerHTML
                type = ENTITY.EMBEDDEDCODE.type
                alignment = (entity.data && entity.data.alignment) || alignment
                let description = _.get(entity, ['data', 'description'], '')
                let url = _.get(entity, ['data', 'url'], '')
                content = [
                    {
                        caption: description,
                        embeddedCodeWithoutScript: `<img alt="${description}" src="${url}" class="img-responsive"/>`,
                        url: url,
                    },
                ]
                break
            case ENTITY.EMBEDDEDCODE.type:
                alignment = (entity.data && entity.data.alignment) || alignment
                let caption = _.get(entity, ['data', 'caption'], '')
                let embeddedCode = _.get(entity, ['data', 'code'], '')
                let script = {}
                let scripts = []
                let scriptTagStart = false
                let height
                let width
                let parser = new htmlparser2.Parser({
                    onopentag: (name, attribs) => {
                        if (name === 'script') {
                            scriptTagStart = true
                            script.attribs = attribs
                        } else if (name === 'iframe') {
                            height = _.get(attribs, 'height', 0)
                            width = _.get(attribs, 'width', 0)
                        }
                    },
                    ontext: (text) => {
                        if (scriptTagStart) {
                            script.text = text
                        }
                    },
                    onclosetag: (tagname) => {
                        if (tagname === 'script' && scriptTagStart) {
                            scriptTagStart = false
                            scripts.push(script)
                        }
                    },
                })
                parser.write(embeddedCode)
                parser.end()

                content = [
                    {
                        caption,
                        embeddedCode,
                        embeddedCodeWithoutScript: embeddedCode.replace(
                            /<script(.+?)\/script>/g,
                            ''
                        ),
                        height,
                        scripts,
                        width,
                    },
                ]

                break
            default:
                return
        }

        // block type of api data should be lower case
        return new ApiDataInstance({
            id: block.key,
            alignment,
            type: type && type.toLowerCase(),
            content,
            styles,
        })
    },
}

export default processor
