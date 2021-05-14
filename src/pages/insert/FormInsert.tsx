import React from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import useNotify from '../../hooks/useToast';
import {receiveRules, addRule} from '../../components/Rule/ruleAction';
import {nanoid} from 'nanoid';
import type {Snippet} from '../../types/Snippet';
import {addSnippet} from '../../components/code/snippetAction';
import {updateSnippetId} from '../../components/editor/preview/editorAction';
import type {Rule} from '../../types/Rule';
import './formInsert.css';
import useVisibility from '../../hooks/useVisibility';
import classNames from 'classnames';
import RulePreview from './RulePreview';

type PropsT = {
  name?: string;
};

export default function FormInsert(props: PropsT): JSX.Element {
  const initState = {id: nanoid(), bad: '', good: '', rule: ''};
  useDocumentTitle('new snippet and convention');

  const dispatch = useDispatch();
  const {visible, show, hide} = useVisibility();
  const notify = useNotify();
  const [editorState, setEditorState] = React.useState(initState);
  const history = useHistory();

  React.useEffect(() => {
    dispatch(receiveRules());
  }, []);

  function resetEditor() {
    setEditorState(initState);
  }

  function handleSubmit(event: any) {
    event.preventDefault();

    if (
      editorState.bad.length === 0 ||
      editorState.good.length === 0 ||
      editorState.rule.length === 0
    ) {
      notify({
        type: 'error',
        message: 'Both Code snippets should not be empty!',
      });
      return;
    }

    const goodSnippet = {
      id: nanoid(),
      body: editorState.good,
      isBad: false,
      lang: 'php',
    };

    const badSnippet: Snippet = {
      id: initState.id,
      body: editorState.bad,
      isBad: true,
      lang: 'php',
      suggestion: goodSnippet.id,
    };

    const rule: Rule = {
      id: nanoid(),
      body: editorState.rule,
      snippets: [initState.id],
    };

    dispatch(addSnippet(goodSnippet));
    dispatch(addSnippet(badSnippet));
    dispatch(addRule(rule));
    console.table({
      bad: badSnippet.id,
      good: goodSnippet.id,
      'rule suggestion': rule.snippets,
    });
    resetEditor();
    notify({type: 'success', message: 'Both Code snippets are added!'});

    history.push(`/convention/${rule.id}`);
  }

  function handleChangeRule(event: any) {
    setEditorState({
      ...editorState,
      rule: event.target.value,
    });
  }

  function handleChangeBadSnippet(event: any) {
    setEditorState({
      ...editorState,
      bad: event.target.value,
    });
  }

  function handleChangeGoodSnippet(event: any) {
    event.preventDefault();
    setEditorState({
      ...editorState,
      good: event.target.value,
    });
  }

  function handleOpenPreview() {
    show();
  }

  function handleClosePreview() {
    hide();
  }

  React.useEffect(() => {
    if (editorState.bad.length > 0) {
      dispatch(updateSnippetId(initState.id));
    }
  }, [editorState]);

  return (
    <div className="grid--cell fl1 wmn0">
      <div className={classNames("overlay", {"open": visible})}>
        <div className="popup">
          <div className="title">
            <h3>Coding convention preview</h3>
          </div>
          <div className="content">
            <RulePreview rule={editorState.rule} badSnippet={editorState.bad} goodSnippet={editorState.good}/>
          </div>
          <div className="action mb16">
            <button className="grid--cell s-btn s-btn__md"
                    onClick={handleClosePreview}>
              close the preview
            </button>
          </div>
        </div>
      </div>
      <form
        id="post-form"
        className="post-form js-post-form"
        data-form-type="question"
        onSubmit={handleSubmit}
      >
        <div id="question-form">
          <div className="bg-white bar-sm bs-md p16 ba bc-black-100">
            <div id="post-title" className="ps-relative mb16">
              <div className="grid fl1 fd-column js-stacks-validation">
                <label className="d-block s-label mb4" htmlFor="rule">
                  Coding Convention
                  <div className="grid">
                    <p className="s-description mt2 grid--cell9">
                      Use plain english and keep the definition simple and short
                    </p>
                  </div>
                </label>
                <div className="fl1 ps-relative">
                  <input
                    id="title"
                    name="title"
                    type="text"
                    maxLength={300}
                    placeholder="e.g. Use always constant instead of magic number and string"
                    className="s-input js-post-title-field"
                    autoComplete="off"
                    value={editorState.rule}
                    onChange={handleChangeRule}
                  />
                </div>
              </div>
            </div>

            <div
              id="post-editor"
              className="post-editor js-post-editor mt0 mb16"
            >
              <div className="ps-relative">
                <label className="s-label mb4 d-block" htmlFor="bad-snippet">
                  Bad Code snippet
                  <p className="s-description mt2">
                    Add a bad code snippet to this convention
                  </p>
                </label>
                <textarea
                  className="snippet"
                  name={'bad'}
                  rows={15}
                  placeholder={'Bad snippet'}
                  value={editorState.bad}
                  onChange={handleChangeBadSnippet}
                />
              </div>
              <div className="ps-relative">
                <label className="s-label mb4 d-block" htmlFor="good-snippet">
                  Good Code snippet
                  <p className="s-description mt2">
                    Add a Good code snippet to this convention
                  </p>
                </label>
                <textarea
                  className="snippet"
                  name={'good'}
                  rows={15}
                  placeholder={'Good snippet'}
                  value={editorState.good}
                  onChange={handleChangeGoodSnippet}
                />
              </div>
              <div className="edit-block">
                <input id="author" name="author" type="text"/>
                <input
                  type="hidden"
                  name="i1l"
                  defaultValue="tKgzJZNt6tbfm4umbxTugXzCeW1yrrQvtLngOkno3nA="
                />
              </div>
            </div>
            <div className="ps-relative" id="tag-editor">
              <div className="ps-relative">
                <div className="form-item p0 js-stacks-validation js-tag-editor-container">
                  <div className="grid ai-center jc-space-between">
                    <label
                      htmlFor="tageditor-replacing-tagnames--input"
                      className="s-label mb4 d-block grid--cell fl1"
                    >
                      Convention Tags
                      <div className="s-description mt2">
                        Add up to 5 tags to describe what your coding convention
                        is about
                      </div>
                    </label>
                  </div>
                  <div className="ps-relative">
                    <div
                      className="js-tag-editor tag-editor multi-line s-input"
                      style={{
                        padding: '0px 9.1px',
                        boxSizing: 'border-box',
                        marginTop: '0px',
                        marginBottom: '0px',
                        width: '100%',
                      }}
                    >
                      <input
                        type="text"
                        autoComplete="off"
                        tabIndex={103}
                        placeholder="e.g. (php, javascript, css)"
                        id="tageditor-replacing-tagnames--input"
                        className="s-input js-tageditor-replacing"
                        style={{width: '19px'}}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="js-tag-suggestions hmn0"/>
            </div>
            <div
              id="question-answer-section"
              className="dno js-show-on-question-and-answer"
            >
              <div id="inline-answer">
                <div id="post-editor-42" className="post-editor js-post-editor">
                  <div className="ps-relative">
                    <div className="wmd-container mb8">
                      <div
                        id="wmd-button-bar-42"
                        className="wmd-button-bar btr-sm"
                      />
                      <div className="js-stacks-validation">
                        <div className="ps-relative">
                          <textarea
                            id="wmd-input-42"
                            name="post-text-answer"
                            className="wmd-input s-input bar0 js-post-body-field"
                            data-post-type-id={2}
                            cols={92}
                            rows={15}
                            tabIndex={103}
                            data-min-length
                            defaultValue={''}
                          />
                        </div>
                        <div className="s-input-message mt4 d-none js-stacks-validation-message"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gsx gs4 mt32 float-right">
          {editorState.rule.length > 0 && editorState.bad.length > 0 && (
            <button
              className="grid--cell s-btn s-btn__outlined"
              type="button"
              onClick={handleOpenPreview}
            >
              See preview
            </button>
          )}
          <button
            className="grid--cell s-btn s-btn__filled"
            type="submit"
            onClick={handleSubmit}
          >
            Submit the convention
          </button>
        </div>
      </form>
    </div>
  );
}
