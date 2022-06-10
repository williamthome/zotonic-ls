import getDoc from "../utils/docs"
import docsConfig, { DocsConfig } from "./docs"

type Config = {
    docs: DocsConfig,
}

const config: Config = {
    docs: docsConfig
}

export default {
    defaults: config,
    getDoc: getDoc(
        docsConfig.docs,
        docsConfig.language,
        docsConfig.version,
        docsConfig.branch
    )
}
