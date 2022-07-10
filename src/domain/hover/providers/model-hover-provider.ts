import { HttpRequest } from '@/domain/http';
import { buildDocumentationHoverProvider } from '../documentation-hover-provider';

export function buildModelHoverProvider(args: {
    host: string;
    httpGet: HttpRequest<string>;
}) {
    return buildDocumentationHoverProvider({
        regex: /(?<=m\.)(acl|acl_rule|acl_user_group|admin|admin_blocks|admin_config|admin_identity|admin_menu|admin_status|auth2fa|authentication|backup|backup_revision|category|client_local_storage|client_session_storage|comment|config|content_group|custom_redirect|development|edge|editor_tinymce|email_dkim|email_receive_recipient|email_status|facebook|filestore|fileuploader|hierarchy|identity|image_edit|import_csv_data|l10n|linkedin|log|log_email|log_ui|mailinglist|media|microsoft|modules|mqtt_ticket|oauth2|oauth2_consumer|oauth2_service|predicate|ratelimit|req|rsc|rsc_gone|search|seo|seo_sitemap|server_storage|signup|site|site_update|ssl_letsencrypt|survey|sysconfig|template|tkvstore|translation|twitter)/,
        genUrl({ regexMatch: model }) {
            return `${args.host}/ref/models/model_${model}.rst`;
        },
        httpRequest: args.httpGet,
    });
}
