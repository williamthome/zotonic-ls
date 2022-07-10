import { HttpRequest } from '@/domain/http';
import { buildDocumentationHoverProvider } from '../documentation-hover-provider';

export function buildFilterHoverProvider(args: {
    host: string;
    httpRequest: HttpRequest<string>;
}) {
    return buildDocumentationHoverProvider({
        regex: /(?<=\|)(first|last|length|to_binary|yesno|add_hour|add_day|add_month|add_week|add_year|date|date_range|datediff|eq_day|in_future|in_past|ne_day|sub_hour|sub_day|sub_month|sub_week|sub_year|timesince|utc|md5|sha1|brlinebreaks|escape|escape_check|escape_ical|escape_link|escapejs|escapejson|escapexml|fix_ampersands|force_escape|linebreaksbr|slugify|unescape|urlencode|pickle|show_media|striptags|truncate_html|sanitize_html|sanitize_url|urlize|embedded_media|without_embedded_media|after|before|chunk|exclude|filter|first|flatten_value|group_by|index_of|is_list|join|last|length|make_list|member|nthtail|random|randomize|range|reversed|slice|sort|split|split_in|tail|vsplit_in|without|inject_recipientdetails|menu_flat|menu_is_visible|menu_expand|menu_rsc|menu_subtree|menu_trail|gravatar_code|twitter|ip2country|ip2geo|is_letsencrypt_valid_hostname|filesizeformat|format_duration|format_integer|format_number|format_price|is_even|is_number|max|min|minmax|rand|round|to_integer|match|replace|group_firstchar|group_title_firstchar|is_a|is_not_a|is_visible|admin_merge_diff|content_type_label|content_type_urls|summary|temporary_rsc|append|capfirst|center|filesizeformat|format_duration|format_integer|format_number|format_price|insert|is_valid_email|length|ljust|log_format_stack|lower|replace_args|rjust|split|stringify|to_name|toc|tokens|trim|truncate|upper|survey_answer_split|survey_any_correct_answer|survey_any_wrong_answer|survey_as_pages|survey_is_stop|survey_is_submit|survey_prepare_matching|survey_prepare_narrative|survey_prepare_thurstone|survey_test_max_points|is_rtl|language|language_dir|language_sort|trans_filter_filled|element|is_site_url|url|url_abs|sanitize_url|is_letsencrypt_valid_hostname|urlize|escape_link|urlencode|parse_url|as_atom|default|if|if_undefined|is_defined|is_undefined|make_value|pprint|to_binary|to_integer|to_json)/,
        genUrl({ regexMatch: filter }) {
            return `${args.host}/ref/filters/filter_${filter}.rst`;
        },
        httpRequest: args.httpRequest,
    });
}
