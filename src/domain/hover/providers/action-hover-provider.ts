import { HttpRequest } from '@/domain/http';
import { buildDocumentationHoverProvider } from '../documentation-hover-provider';

export function buildActionHoverProvider(args: {
    host: string;
    httpGet: HttpRequest<string>;
}) {
    return buildDocumentationHoverProvider({
        regex: /(?<=action={\s*)(with_args|admin_tasks|redirect_incat|module_rescan|module_toggle|backup_start|config_delete|config_toggle|dialog_config_delete|dialog_config_edit|dialog_config_new|development_templates_stream|dialog|dialog_open|dialog_close|overlay_open|overlay_close|add_class|animate|buttonize|effect|fade_in|fade_out|hide|insert_after|insert_before|insert_bottom|insert_top|jquery_effect|mask|mask_progress|move|remove|remove_class|replace|set_class|show|slide_down|slide_fade_in|slide_fade_out|slide_toggle|slide_up|toggle|toggle_class|unmask|update|update_iframe|editor_add|editor_remove|zlink|zmedia|zmedia_choose|zmedia_has_chosen|notify|postback|trigger_event|publish|disable|enable|event|focus|form_reset|reset|set_value|submit|typeselect|validation_error|script|dialog_mail_page|dialog_mailing_page|mailing_page_test|mailinglist_confirm|mailinglist_unsubscribe|alert|confirm|growl|redirect|reload|Predicates|dialog_predicate_new|link|unlink|delete_media|delete_rsc|dialog_delete_rsc|dialog_duplicate_rsc|dialog_edit_basics|dialog_media_upload|dialog_new_rsc|moreresults|template|auth_disconnect|delete_username|dialog_delete_username|dialog_set_username_password|dialog_user_add|logoff)/,
        genUrl({ regexMatch: action }) {
            return `${args.host}/ref/actions/action_${action}.rst`;
        },
        httpRequest: args.httpGet,
    });
}
